# gulp postcss 转rpx插件
- 支持1px不转
- 支持comment

### 用法
``` js
const px2rpxPlug = require('gulp-postcss-px2rpx');

const px2rpx = cssAst => {
    const px2rpxIns = new px2rpxPlug({
        noTrans1px: true,
        designWidth: 1242
    });
    px2rpxIns.trans(cssAst);
};

.pipe(postcss([px2rpx]))
```