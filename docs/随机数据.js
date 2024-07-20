// script.js

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
}

var defaultSchema = {
    'title': '节点',
    'type': 'object',
    'required': ['名称', '帮助', '日期', '参数', '示例'],
    'properties': {
        '名称': {
            'type': 'string',
            'default': '默认名称',
            'minLength': 4,
            'maxLength': 60,
            'options': {
                'hidden': false,
                'inputAttributes': {
                    'placeholder': '输入名称'
                }
            }
        },
        '帮助': {
            'type': 'string',
            'default': '帮助信息'
        },
        '日期': {
            'type': 'string',
            'format': 'date'
        },
        '参数': {
            'title': '节点参数',
            'type': 'array',
            'format': 'table',
            'uniqueItems': true,
            'items': {
                'type': 'object',
                'properties': {
                    '参数': {
                        'type': 'string',
                        'default': '默认参数'
                    },
                    '单位': {
                        'type': 'string',
                        'default': '单位'
                    },
                    '类型': {
                        'type': 'string',
                        'enum': ['字符串', '双精度', '布尔', '整数']
                    },
                    '参数名称': {
                        'type': 'string'
                    },
                    '值': {
                        'type': 'string'
                    },
                    '子参数': {
                        'title': '子参数',
                        'type': 'array',
                        'format': 'table',
                        'items': {
                            'type': 'object',
                            'properties': {
                                '子参数': {
                                    'type': 'string'
                                },
                                '子参数值': {
                                    'type': 'string'
                                }
                            }
                        }
                    }
                }
            }
        },
        '示例': {
            'title': '示例JSON数据',
            'type': 'object',
            'properties': {
                '输入': {
                    'title': '输入',
                    'type': 'string',
                    'default': '输入示例'
                },
                '输出': {
                    'title': '输出',
                    'type': 'string',
                    'default': '输出示例'
                }
            }
        }
    }
};

createEditor(defaultSchema);

// 用随机数据更新表单
document.getElementById('setvalue').addEventListener('click', function () {
    var randomData = generateRandomData();
    document.getElementById('output-textarea').value = JSON.stringify(randomData, null, 2);
    window.editor.setValue(randomData);
});

// 更新模式
document.getElementById('setschema').addEventListener('click', function () {
    var schema = JSON.parse(document.getElementById('schema-textarea').value);
    createEditor(schema);
});

// 用默认模式更新模式文本框
document.getElementById('schema-textarea').value = JSON.stringify(defaultSchema, null, 2);

// 处理表单中的变化并更新输出文本框
window.editor.on('change', function () {
    var json = window.editor.getValue();
    document.getElementById('output-textarea').value = JSON.stringify(json, null, 2);

    // 验证JSON
    var ajv = new Ajv({allErrors: true});
    var valid = ajv.validate(defaultSchema, json);
    var errorsTextarea = document.getElementById('validate-textarea');
    if (!valid) {
        errorsTextarea.value = JSON.stringify(ajv.errors, null, 2);
    } else {
        errorsTextarea.value = '有效!';
    }
});

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

function generateGraph() {
    var nodes = [];
    var edges = [];
    for (var i = 0; i < 10; i++) {
        nodes.push({id: i, label: '节点 ' + i});
        if (i > 0) {
            edges.push({from: i - 1, to: i});
        }
    }
    return {nodes: nodes, edges: edges};
}

// 用图形数据更新表单
document.getElementById('setvalue').addEventListener('click', function () {
    var graph = generateGraph();
    document.getElementById('output-textarea').value = JSON.stringify(graph, null, 2);
    window.editor.setValue(graph);
});
