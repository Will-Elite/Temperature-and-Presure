// Presure (Hàm này tạo ra 1 đồng hồ hình tròn)
function createRadGauge (id, minVal, maxVal, unit) {
    // Chuyển đổi tọa độ từ góc cực sang tọa độ Cartesian (tọa độ XY)
    function polarToCartesian (centerX, centerY, radius, rad) {
        return {
            x: centerX + (radius * Math.cos(rad)),
            y: centerY + (radius * Math.cos(rad))
            // centerX và centerY là tọa độ trung tâm của vòng tròn
            // radius là bán kính của vòng tròn
            // rad là góc đo theo đơn vị radian
            // hàm này trả về một dối tượng với các thuộc tính X và Y
        };
    }


}