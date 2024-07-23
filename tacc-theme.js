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
}

const tacc = new TACCTheme();