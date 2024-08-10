let defaultSchema = {}; // 初始化默认模式

// 使用 Ajax 请求读取 defaultSchema.json 文件
fetch('defaultSchema.json')
    .then(response => response.json())
    .then(data => {
        defaultSchema = data;
        createEditor(defaultSchema);

        // 用默认模式更新模式文本框
        document.getElementById('schema-textarea').value = JSON.stringify(defaultSchema, null, 2);
    })
    .catch(error => console.error('读取 defaultSchema.json 文件出错:', error));

// 初始化编辑器
function createEditor(schema) {
    if (window.editor) {
        window.editor.destroy();
    }
    JSONEditor.defaults.editors.table = JSONEditor.defaults.editors.array; // 支持 table 格式
    window.editor = new JSONEditor(document.getElementById('json-editor-form'), {
        schema: schema,
        theme: 'bootstrap4',
        iconlib: 'fontawesome5',
        disable_edit_json: true,
        disable_properties: true,
        no_additional_properties: true,
        required_by_default: true,
        display_required_only: true,
        show_opt_in: true,
        prompt_before_delete: true
    });

    // 处理表单中的变化并更新输出文本框
    window.editor.on('change', function () {
        const json = window.editor.getValue();
        document.getElementById('output-textarea').value = JSON.stringify(json, null, 2);
    });
}

// 生成随机数据
function generateRandomData() {
    return {
        '名称': '随机名称 ' + Math.floor(Math.random() * 100),
        '帮助': '帮助信息',
        '日期': new Date().toISOString().slice(0, 10),
        '参数': [
            {
                '参数': '随机参数 ' + Math.floor(Math.random() * 100),
                '单位': '单位',
                '类型': '字符串',
                '参数名称': '参数名称',
                '值': '值',
                '子参数': [
                    {
                        '子参数': '子参数',
                        '子参数值': '子参数值'
                    }
                ]
            }
        ],
        '示例': {
            '输入': '输入示例',
            '输出': '输出示例'
        }
    };
}

// 生成图形数据
function generateGraph() {
    const nodes = [];
    const edges = [];
    for (let i = 0; i < 10; i++) {
        nodes.push({ id: i, label: '节点 ' + i });
        if (i > 0) {
            edges.push({ from: i - 1, to: i });
        }
    }
    return { nodes: nodes, edges: edges };
}

// 用随机数据或图形数据更新表单
document.getElementById('setvalue').addEventListener('click', function () {
    const randomData = generateRandomData(); // 如果需要图形数据，可以将这一行替换为 const graph = generateGraph();
    document.getElementById('output-textarea').value = JSON.stringify(randomData, null, 2);
    window.editor.setValue(randomData);
});

// 更新模式
document.getElementById('setschema').addEventListener('click', function () {
    try {
        const schema = JSON.parse(document.getElementById('schema-textarea').value);
        createEditor(schema);
    } catch (e) {
        alert('无效的JSON模式');
    }
});

// 保存模式
document.getElementById('save-schema').addEventListener('click', function () {
    const updatedSchema = window.editor.getValue(); // 从编辑器获取当前的值
    fetch('http://127.0.0.1:5000/save-schema', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSchema) // 发送 JSON 数据
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('网络响应错误: ' + text);
            });
        }
        return response.json(); // 解析 JSON 响应
    })
    .then(data => {
        alert('保存成功: ' + JSON.stringify(data));
    })
    .catch(error => {
        console.error('保存文件出错:', error);
        alert('保存文件出错: ' + error.message);
    });
});
