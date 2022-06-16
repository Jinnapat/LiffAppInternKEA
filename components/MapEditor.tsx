import { MapContainer, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import type { LayerGroup, MapOptions } from 'leaflet'
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { liffContext } from "../pages"
import type { LayerEvent } from 'leaflet'
import LoadPage from './LoadPage'
import { supabase } from '../utils/supabaseClient'
import { FeatureCollection } from 'geojson'

import 'leaflet/dist/leaflet.css'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet.locatecontrol/src/L.Control.Locate.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import Image from 'next/image'

interface MapEditorProps {
    status: string,
    userId: string,
    plot_id: string,
    plot: string,
    setPlot: Dispatch<SetStateAction<string>>
}

interface SaveControlProps {
    status: string,
    makeChange: boolean,
    setUploading: Dispatch<SetStateAction<boolean>>,
    userId: string,
    plot: string,
    plot_id: string
}

interface LeafletDrawProps {
    status: string,
    setMakeChange: Dispatch<SetStateAction<boolean>>,
    plot: string,
    setPlot: Dispatch<SetStateAction<string>>,
    userId: string
}

const LocateControl = () => {
    const map = useMap()
    useEffect(() => {
        L.control.locate().addTo(map)
    }, [map])
    return null
}

const SaveControl = (props: SaveControlProps) => {
    const context = useContext(liffContext)

    const getPromptText = () => {
        return "ตั้งชื่อแปลง " + (props.status == "edit" ? "(ทิ้งว่างเพื่อใช้ชื่อเดิม)" : "(ห้ามว่าง)")
    }

    const saveChange = async () => {
        if (context == null) return
        var plot_name = prompt(getPromptText())
        while (plot_name == '' && props.status == "draw") {
            plot_name = prompt(getPromptText())
        }
        if ((!props.makeChange || props.plot == null) && plot_name == '') {
            await supabase.from("users").update({status: "free", param: ""}).match({userId: props.userId})
            context.closeWindow()
            return
        }

        props.setUploading(true)
        if (props.status == "draw") {
            await supabase.from("plots").insert({
                created_by: props.userId,
                name: plot_name,
                plot_bounds: props.plot
            })
        } else if (props.status == "edit") {
            const updateData: any = { plot_bounds: props.plot }
            if (plot_name != '') updateData.name = plot_name
            await supabase.from("plots").update(updateData).match({id: props.plot_id})
        }

        await supabase.from("users").update({status: "free", param: ""}).match({userId: props.userId})
        alert("uploaded")
        context.closeWindow()
    }

    const closeWindow = () => {
        if (context == null) return
        context.closeWindow()
    }

    if (props.status != "draw" && props.status != "edit") return null
    return (
        <div className="leaflet-bottom leaflet-right mb-7">
            <div className="leaflet-bar leaflet-control">
                <a onClick={saveChange} className='pt-1'>
                    <Image src="/check.png" alt="check" width="14" height="14"/>
                </a>
                <a onClick={closeWindow} className='pt-0.5'>
                    <Image src="/close.png" alt="close" width="12" height="12"/>
                </a>
            </div>
        </div>
    )
}

const LeafletDraw = (props: LeafletDrawProps) => {
    const [drawed, setDrawed] = useState(false)
    
    const createPolygon = (reactFGref: L.FeatureGroup | null) => {
        if (reactFGref == null) return
        if (props.status != "edit" && props.status != "view") return
        const feature: FeatureCollection = JSON.parse(props.plot)
        let leafletGeoJSON = new L.GeoJSON(feature)
        let leafletFG = reactFGref
    
        leafletGeoJSON.eachLayer((layer) => {
          leafletFG.addLayer(layer)
        })

        if (props.status == "view") {
            supabase.from('users').update({status: "free", param: ""}).match({userId: props.userId})
        }
    }
    
    return (
        <FeatureGroup ref={(reactFGref) => createPolygon(reactFGref)}>
            {(props.status == "draw" || props.status == "edit") ? <EditControl 
                position='bottomleft'
                draw={{
                    polyline: false,
                    rectangle: false,
                    polygon: (!drawed && props.status == "draw"),
                    circle: false,
                    marker: false,
                    circlemarker: false
                }}
                onCreated={(data: LayerEvent) => {
                    const layerGroup = data.layer as LayerGroup
                    props.setPlot(JSON.stringify(layerGroup.toGeoJSON()))
                    props.setMakeChange(true)
                    setDrawed(true)
                }}
                onEdited={(data: any) => {
                    const geojson = data.layers.getLayers()[0].toGeoJSON()
                    props.setPlot(JSON.stringify(geojson))
                    props.setMakeChange(true)
                }}
            /> : null}
        </FeatureGroup>
    )
}

const MapEditor = (props: MapEditorProps) => {
    const [uploading, setUploading] = useState(false)
    const [makeChange, setMakeChange] = useState(false)

    const mapOptions: MapOptions = {
        center: [14.078453027095621, 100.60145565246025],
        zoom: 15,
        scrollWheelZoom: true
    }

    if (uploading) return <LoadPage text="uploading..." />
    return (
        <div className="w-screen h-screen shadow-xl border-3">
            <MapContainer className="w-full h-full" {...mapOptions}>
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocateControl />
                <LeafletDraw 
                    status={props.status} 
                    setMakeChange={setMakeChange} 
                    plot={props.plot} 
                    setPlot={props.setPlot}
                    userId={props.userId}
                />
                <SaveControl 
                    status={props.status}
                    makeChange={makeChange}
                    setUploading={setUploading}
                    userId={props.userId}
                    plot={props.plot}
                    plot_id={props.plot_id}
                />
            </MapContainer>
        </div>
    )
}

export default MapEditor