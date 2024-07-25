class TACCTheme {
    constructor() {
        this.name = 'TACC Theme';
        this.version = '0.1';
    }

    render_table(table_raw, rows_raw, header_render, row_render, target) {
        var rows = [];
        rows_raw.forEach((row)=>{
            var rendered_row = row_render(row, table_raw);
            // check if it is a row or a row array
            if (Array.isArray(rendered_row)) {
                rendered_row.forEach((r)=>{
                    rows.push(r);
                });
            } else {
                rows.push(rendered_row);
            }
        }); 
        let render = $.create('table', {
            contents: [
                header_render(table_raw),
                {tag: 'tbody', contents: rows}
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