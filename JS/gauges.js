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
            // hàm này trả về một dối tượng với các thuộc tính X và Y, đại diện cho vị trí trên mặt phẳng 2D
        };
    }

    function arc(x, y, radius, val, minVal, maxVal) {
        var start = polarToCartesian (x, y, radius, -Math.PI);
        var end = polarToCartesian(x, y, radius, -Math.PI*(1 - 1/(maxVal - minVal) * (val - minVal)));

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, 0, 1, end.x, end.y
        ].join(" ");

        return d;
        // Tạo đường cong cung tròn từ giá trị tối thiểu đến giá trị hiện tại của đồng hồ
        // Tính toán điểm bắt đầu và điểm kết thúc của cung tròn bằng cách sử dụng polarToCartesian
        // Trả chuổi d cho thuộc tính của thẻ SVG <path>, mô tả hình dạng cung tròn
    }

    var tmpl = 
    '<svg class="rGauge" viewBox="0 0 200 145">'+ 
    // Thẻ SVG (Scable Vector Grapics) là một dịnh dạng đồ họa dùng để hiển thị hình ảnh vector trên web
      '<path class="rGauge-base" id="'+id+'_base" stroke-width="30" />'+ 
      '<path class="rGauge-progress" id="'+id+'_progress" stroke-width="30" stroke="#1565c0" />'+ 
      '<text class="rGauge-val" id="'+id+'_val" x="100" y="105" text-anchor="middle"></text>'+  
      '<text class="rGauge-min-val" id="'+id+'_minVal" x="40" y="125" text-anchor="middle"></text>'+  
      '<text class="rGauge-max-val" id="'+id+'_maxVal" x="160" y="125" text-anchor="middle"></text>'+  
    '</svg>';

}