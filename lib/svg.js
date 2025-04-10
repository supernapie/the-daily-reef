const svgcache = {};

export default (obj) => {
    let {url} = obj;

    if (svgcache[url]) {
        let {paths, ow, oh} = svgcache[url];
        obj.paths = paths;
        obj.ow = ow;
        obj.oh = oh;
        return obj;
    }
 
    return fetch(new URL(url, import.meta.url)).then((res) => {
        return res.text();
    }).then((svgtext) => {
        let svgEl = document.createElement('div');
        svgEl.innerHTML = svgtext;
        let fillMap = {};
        let style = svgEl.querySelector('style');
        if (style) {
            let css = style.innerHTML;
            css = css.replace(/[\r\n]/g, '');
            css = css.replace(
                /\.([a-zA-Z0-9\-_]+)\{fill:(#[0-9a-fA-F]{6});\}/g,
                (match, className, color) => {
                    fillMap[className] = color;
                    return '';
                }
            );
        }
        let extractFill = (el) => {
            let fill = el.getAttribute('fill');
            if (!fill) {
                let className = el.getAttribute('class');
                if (className && fillMap[className]) {
                    fill = fillMap[className];
                } else  {
                    fill = 'black';
                }
            }
            return fill;
        };
        let parsers = {
            path: (el) => {
                let fill = extractFill(el);
                let d = el.getAttribute('d');
                return { d, fill };
            },
            rect: (el) => {
                let fill = extractFill(el);
                let x = Number(el.getAttribute('x')) || 0;
                let y = Number(el.getAttribute('y')) || 0;
                let w = Number(el.getAttribute('width')) || 0;
                let h = Number(el.getAttribute('height')) || 0;
                return {
                    d: `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`,
                    fill
                };
            },
            circle: (el) => {
                let fill = extractFill(el);
                let cx = Number(el.getAttribute('cx')) || 0;
                let cy = Number(el.getAttribute('cy')) || 0;
                let r = Number(el.getAttribute('r')) || 0;
                return {
                    d: `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy}`,
                    fill
                };
            },
            ellipse: (el) => {
                let fill = extractFill(el);
                let cx = Number(el.getAttribute('cx')) || 0;
                let cy = Number(el.getAttribute('cy')) || 0;
                let rx = Number(el.getAttribute('rx')) || 0;
                let ry = Number(el.getAttribute('ry')) || 0;
                return {
                    d: `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}`,
                    fill
                };
            },
            polygon: (el) => {
                let fill = extractFill(el);
                let points = el.getAttribute('points').trim().split(/\s+/).map((point) => {
                    return point.split(',').map(Number);
                });
                let d = points.map((point, i) => {
                    return (i === 0 ? 'M' : 'L') + point.join(',');
                }).join(' ') + ' Z';
                return { d, fill };
            },
            g: (el) => {
                return [...el.childNodes].reduce((acc, child) => {
                    let parsed = parseEl(child);
                    if (parsed) {
                        acc.push(parsed);
                    }
                    return acc;
                }, []);
            }
        };
        parsers.polyline = parsers.polygon;
        parsers.svg = parsers.g;
        let parseEl = (el) => {
            if (parsers[el.tagName]) {
                return parsers[el.tagName](el);
            } else {
                return false;
            }
        };

        let ow = Number(svgEl.querySelector('svg').getAttribute('width').replace('px', '')) || obj.ow;
        let oh = Number(svgEl.querySelector('svg').getAttribute('height').replace('px', '')) || obj.oh;
        let paths = parseEl(svgEl.querySelector('svg'));
        svgcache[url] = {paths, ow, oh};
        obj.paths = paths;
        obj.ow = ow;
        obj.oh = oh;
        return obj;
    });
};
