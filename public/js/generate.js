window.onload = main;

function main() {
    let data = [];
    let url = '/getdata';

    if (location.search) {
        url += location.search;
    }
    ajax({
            url,
            responseType: 'json',
            method: 'get'
        })
        .then(res => {
            if (Array.isArray(res)) {
                data = res;

                ajax({
                        url: '/image/idcard.svg',
                        responseType: 'text'
                    })
                    .then(res => {
                        const body = document.body;
                        data.map(student => {
                            let svg = res;
                            svg = svg.replace('{{name}}', student.name);
                            svg = svg.replace('{{branch}}', student.branch);
                            svg = svg.replace('{{DOB}}', student.DOB);
                            svg = svg.replace('{{bg}}', '');
                            svg = svg.replace('{{batch}}', student.batch);

                            JsBarcode('#barcode', student.id, {
                                displayValue: false
                            });

                            const bcode = barcode.outerHTML;
                            const burl = svgToDataURL(bcode);

                            svg = svg.replace('{{barcode}}', burl);

                            toDataURL(`/profile/${student.id}`, (profile) => {
                                svg = svg.replace('{{profile}}', profile);
                                const url = svgToDataURL(svg);
                                body.innerHTML += `<div class='image'><img src='${url}'></div>`;
                            })

                        });
                    });
            }
        });
}



const svgToDataURL = svgStr => {
    const encoded = encodeURIComponent(svgStr)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22')

    const header = 'data:image/svg+xml,'
    const dataUrl = header + encoded

    return dataUrl
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}