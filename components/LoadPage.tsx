interface LoadPageProps {
    text: string
}

const LoadPage = (props: LoadPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="
                rounded-full
                border-8 
                border-b-lime-400
                my-10
                w-20 
                h-20
                animate-spin
            "></div>
            <i>{props.text}</i>
        </div>
    )
}

export default LoadPage