

function getTempColor(t) {
	if (t >= 35) {
		return '#ff5722';
	} else if (t >= 30) {
		return '#ff9800';
	} else if (t >= 25) {
		return '#ffc107';
	} else if (t >= 18) {
		return '#4caf50';
	} else if (t > 10) {
		return '#8bc34a';
	} else if (t >= 5) {
		return '#00bcd4';
	} else if (t >= -5) {
		return '#03a9f4';
	} else {
		return '#2196f3';
	}
}

function getHumColor(x) {
	var colors = ['#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#1E88E5','#1976D2','#1565C0','#0D47A1','#0D47A1'];
	return colors[Math.round(x/10)];
}

function refresh() {
	// Tạo giá trị random cho nhiệt độ và độ ẩm
    var randomTemp = Math.random() * 50; // Giả sử nhiệt độ từ 0 đến 50°C
    var randomHum = Math.random() * 100; // Giả sử độ ẩm từ 0 đến 100%

    // Cập nhật giá trị cho các đồng hồ đo
    tempGauge.setVal(randomTemp).setColor(getTempColor(randomTemp));
    humGauge.setVal(randomHum).setColor(getHumColor(randomHum));

    // In ra console để kiểm tra
    console.log('Temperature: ' + randomTemp + ' °C');
    console.log('Humidity: ' + randomHum + ' %');
}

var tempGauge = createVerGauge('Temp', -20, 60, ' °C').setVal(0).setColor(getTempColor(0));
var humGauge = createRadGauge('Pres', 0, 100, '%').setVal(0).setColor(getHumColor(0));

document.getElementById('refresh').addEventListener('click', refresh);
setTimeout(refresh, 100);