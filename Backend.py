from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # 启用 CORS


@app.route('/save-schema', methods=['POST'])
def save_schema():
    try:
        # 获取 JSON 数据
        data = request.json
        # 打印 JSON 数据
        print("Received JSON data:", data)

        # 将 JSON 数据保存到本地文件
        with open('Json_data.json', 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)

        # 返回成功消息
        return jsonify("JSON data received, printed, and saved to file"), 200
    except Exception as e:
        # 捕获异常并返回错误消息
        return jsonify(str(e)), 500


if __name__ == '__main__':
    app.run(debug=True)
