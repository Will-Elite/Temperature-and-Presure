

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
    // Sử dụng fetch để lấy dữ liệu từ server
    fetch('http://localhost:3000/data')
        .then(response => {
            // Kiểm tra xem phản hồi có thành công hay không
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Chuyển đổi phản hồi thành JSON
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu JSON nhận được
            console.log('Temperature:', data.temp);
            console.log('Humidity:', data.hum);

            var randomTemp = data.temp;
            var randomHum = data.hum;

            // Cập nhật giá trị cho các đồng hồ đo
            tempGauge.setVal(randomTemp).setColor(getTempColor(randomTemp));
            humGauge.setVal(randomHum).setColor(getHumColor(randomHum));

            // In ra console để kiểm tra
            console.log('Temperature: ' + randomTemp + ' °C');
            console.log('Humidity: ' + randomHum + ' %');
        })
        .catch(error => {
            // Xử lý lỗi
            console.error('There was a problem with the fetch operation:', error);
        });
}


var tempGauge = createVerGauge('Temp', -20, 60, ' °C').setVal(0).setColor(getTempColor(0));
var humGauge = createRadGauge('Pres', 0, 100, '%').setVal(0).setColor(getHumColor(0));

document.getElementById('refresh').addEventListener('click', refresh);
setTimeout(refresh, 100);