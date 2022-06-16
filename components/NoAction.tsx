const NoAction = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-3">
            <div className="flex flex-col gap-y-5 border-2 shadow rounded p-5 py-8">
                <h1 className="text-xl text-sky-900">ไม่พบการทำงาน</h1>
                <p className="text-gray-500">กรุณากลับไปที่แชทบอท เพื่อป้อนคำสั่งก่อน คำสั่งที่ใช้ได้ทั้งหมดได้แก่</p>
                <div className="flex flex-col pl-4">
                    <i>คำสั่ง</i>
                    <i>เพิ่มแปลง</i>
                    <i>แก้ไขแปลง</i>
                    <i>ดูแปลง</i>
                    <i>รายการแปลง</i>
                </div>
            </div>
            
        </div>
    )
}

export default NoAction