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
        let paths = [];
        let el = document.createElement('div');
        el.innerHTML = svgtext;
        el.querySelectorAll('path, rect').forEach((path) => {
            if (path.tagName === 'rect') {
                let x = Number(path.getAttribute('x')) || 0;
                let y = Number(path.getAttribute('y')) || 0;
                let w = Number(path.getAttribute('width')) || 0;
                let h = Number(path.getAttribute('height')) || 0;
                paths.push(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`);
            } else if (path.tagName === 'path') {
                paths.push(path.getAttribute('d'));
            }
        });
        let ow = Number(el.querySelector('svg').getAttribute('width').replace('px', '')) || obj.ow;
        let oh = Number(el.querySelector('svg').getAttribute('height').replace('px', '')) || obj.oh;
        svgcache[url] = {paths, ow, oh};
        obj.paths = paths;
        obj.ow = ow;
        obj.oh = oh;
        return obj;
    });
};
