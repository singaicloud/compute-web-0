class TACCTheme {
    constructor() {
        this.name = 'TACC Theme';
        this.version = '0.1';
    }

    render_table(header, data, target) {
        let render = $.create('table', {
            contents: [
                $.create('thead', {
                    contents: [
                        $.create('tr', {
                            contents: header.map(function(cell) {
                                return $.create('th', {contents: cell})
                            })
                        })
                    ]
                }),
                $.create('tbody', {
                    contents: data.map(function(row) {
                        return $.create('tr', {
                            contents: row.map(function(cell) {
                                return $.create('td', {contents: cell})
                            })
                        })
                    })
                })
            ]
        });
        $(target)._.contents(render);
        return render;
    }

    extract_form(target) {
        var data = {};
        $$(target + ' input, select').forEach(function(input){
            // use switch based on type
            switch($(input).getAttribute('type')){
                case 'checkbox':
                    data[$(input).getAttribute('name')] = $(input).checked;
                    break;
                default:
                    data[$(input).getAttribute('name')] = $(input).value;
            }
        });
        return data;
    }
}

const tacc = new TACCTheme();