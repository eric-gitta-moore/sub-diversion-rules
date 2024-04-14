import yaml from "yamljs";
import path from "node:path";
import url from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

void async function () {
    function write({conf, name}) {
        fs.writeFileSync(
            path.join(__dirname, `./${name}.json`),
            JSON.stringify(conf, null, 2),
        );
    }

    write({conf: yaml.load(path.join(__dirname, `../base.yml`)), name: `system-proxy`});
    write({conf: yaml.load(path.join(__dirname, `../tun.yml`)), name: `tun`});
}()
