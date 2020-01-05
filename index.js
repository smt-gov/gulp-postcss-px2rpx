/**
 * @file index.js
 * @author xiaohong8023@outlook.com
 * @date 2020-01-05
 */

const rePx = /\b(\d+(\.\d+)?)px\b/;

class px2rpxPlug {

    /**
     * constructor 构造函数
     *
     * @param {Object} opts 配置项
     * @param {number} opts.designWidth 视觉稿尺寸; default: 750
     * @param {number} opts.precision 精确度 保留的小数点单位; default: 3
     * @param {string} opts.keepComment 声明不转的注释; default: 'px2rpx: no'
     */
    constructor(options = {}) {
        const {
            designWidth = 750,
            noTrans1px = true,
            keepComment = 'px2rpx: no',
            precision = 3
        } = options;

        this.ratio = 750 / designWidth;
        this.reComment = new RegExp(`\/\\s*\\*\\s*${keepComment}\\s*\\*\/`);
        this.rePureComment = new RegExp('^' + keepComment + '$');
        this.noTrans1px = noTrans1px;
        this.precision = precision;
    }

    calc(val) {
        const rePxGlobal = new RegExp(rePx.source, 'g');
        return val.replace(rePxGlobal, ($0, $1) => {
            if (+$1 === 1 && this.noTrans1px) {
                return $0;
            }
            let num = this.ratio * parseInt($1, 10);
            num = num.toFixed(this.precision);
            num = parseInt(num, 10) === +num ? parseInt(num, 10) : num;
            return num + 'rpx';
        });
    }

    trans(cssAst) {
        cssAst.walkRules(rule => {
            rule.walk(node => {
                if (node.type === 'decl' && rePx.test(node.value)) {
                    let nodeRaws = node.raws;
                    if (
                        nodeRaws.value
                        && nodeRaws.value.raw
                        && this.reComment.test(nodeRaws.value.raw)
                    ) {
                        return;
                    }

                    let nextNode = node.next();
                    if (nextNode
                        && nextNode.type === 'comment'
                        && this.rePureComment.test(nextNode.text.trim())) {
                        return;
                    }

                    node.value = this.calc(node.value);
                }
            });
        });
    }
}

module.exports = px2rpxPlug;
