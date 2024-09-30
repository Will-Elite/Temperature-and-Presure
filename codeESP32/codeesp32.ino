#include <ModbusMaster.h>
#include <WiFi.h>
#include <WebServer.h>

// Khai báo đối tượng ModbusMaster
ModbusMaster node;

// Địa chỉ của các thiết bị
const uint8_t TK4_ADDRESS = 1; // temperature
const uint8_t MT4Y_ADDRESS = 2; // pressure

// Khai báo các địa chỉ thanh ghi
const uint16_t TK4_REGISTER_ADDRESS = 0x03E8;  // 301001 -> 03E8
const uint16_t MT4Y_REGISTER_ADDRESS = 0;      // 30001 -> 0

// Thông tin kết nối WiFi
const char* ssid = "ELT_TEST";
const char* password = "Elite@2024";

// Khai báo đối tượng WebServer trên port 80
WebServer server(80);

// Khai báo biến cho nhiệt độ và áp suất
float temperature = 0; // Nhiệt độ mẫu
float pressure = 0;     // Áp suất mẫu

// Thời gian để cập nhật dữ liệu
unsigned long previousMillis = 0; // Thời gian trước đó
const long interval = 10000; // 10 giây

// Hàm xử lý yêu cầu đến đường dẫn "/data"
void handleData() {
  // Tạo JSON string để trả về
  String jsonResponse = "{";
  jsonResponse += "\"device\": \"HaHTheBox\","; // Thêm trường "device"
  jsonResponse += "\"temperature\": " + String(temperature) + ",";
  jsonResponse += "\"pressure\": " + String(pressure);
  jsonResponse += "}";

  // Thêm header CORS
  server.sendHeader("Access-Control-Allow-Origin", "*"); // Cho phép tất cả nguồn gốc
  server.sendHeader("Access-Control-Allow-Methods", "GET"); // Phương thức được phép
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type"); // Headers cho phép

  // Gửi phản hồi với định dạng JSON
  server.send(200, "application/json", jsonResponse);
}

void setup() {
  // Khởi động Serial2 với tốc độ 9600 baud
  Serial2.begin(9600, SERIAL_8N1, 16, 17);

  // Cấu hình đối tượng ModbusMaster
  node.begin(TK4_ADDRESS, Serial2);  // Đặt địa chỉ mặc định ban đầu là TK4

  // Khởi tạo Serial để debug
  Serial.begin(9600);

  // In thông báo bắt đầu kết nối WiFi
  Serial.println("Connecting to WiFi...");
  Serial.print("SSID: ");
  Serial.println(ssid);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  int attempts = 0;
  
  // Kiểm tra kết nối với tối đa 20 lần thử (khoảng 20 giây)
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi.");
    return; // Không chạy tiếp nếu không kết nối được WiFi
  }

  // Đăng ký đường dẫn "/data" và gán hàm xử lý
  server.on("/data", handleData);

  // Bắt đầu server
  server.begin();
  Serial.println("Web server started. You can access the server at:");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/data");
}

void loop() {
  uint8_t result;
  uint16_t data;

  // Đọc giá trị từ TK4 (địa chỉ 1)
  node.begin(TK4_ADDRESS, Serial2);  // Chuyển sang địa chỉ TK4
  result = node.readInputRegisters(TK4_REGISTER_ADDRESS, 1);

  if (result == node.ku8MBSuccess) {
    data = node.getResponseBuffer(0);  // Lấy dữ liệu từ buffer
    temperature = data / 10.0;  // Ví dụ: chuyển đổi sang giá trị thực
    Serial.print("TK4 Present Value: ");
    Serial.println(temperature);
  } else {
    Serial.print("TK4 Error: ");
    Serial.println(result);
  }
  delay(200);
  // Đọc giá trị từ MT4Y (địa chỉ 2)
  node.begin(MT4Y_ADDRESS, Serial2);  // Chuyển sang địa chỉ MT4Y
  result = node.readInputRegisters(MT4Y_REGISTER_ADDRESS, 1);

  if (result == node.ku8MBSuccess) {
    data = node.getResponseBuffer(0);  // Lấy dữ liệu từ buffer
    pressure = data / 10.0;  // Ví dụ: chuyển đổi sang giá trị thực
    Serial.print("MT4Y Measured Value: ");
    Serial.println(pressure);
  } else {
    Serial.print("MT4Y Error: ");
    Serial.println(result);
  }

  // Xử lý các yêu cầu HTTP
  server.handleClient();

  // Cập nhật giá trị nhiệt độ và áp suất mỗi 10 giây
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    Serial.print("Updated temperature: ");
    Serial.println(temperature);
    Serial.print("Updated pressure: ");
    Serial.println(pressure);
  }
  delay(1000);
}
