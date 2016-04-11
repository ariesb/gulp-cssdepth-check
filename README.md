# gulp-cssdepth-check
Gulp plugin to check for maximum CSS depth

## Usage

First, install `gulp-cssdepth-check` as a development dependency:

```shell
npm install --save-dev gulp-cssdepth-check
```

Then, add it to your `gulpfile.js`:

```js
var cssdepth = require('gulp-cssdepth-check');

gulp.task('check-styles-depth', function() {
  gulp.src('src/css/*.css')
    .pipe(cssdepth({
      depthAllowed: 3,
      showStats: true,
      throwError: true
    }));
});
```

## API

### cssdepth(options)

#### options
Type: `Object`

#### options.depthAllowed
Type: `numeric` Default: `3`

```js
gulp.src('src/css/*.css')
  .pipe(cssdepth({
    'depthAllowed': 3
  }));
```

#### options.showStats
Type: `boolean` Default: `true`

Shows the breakdown of Selector Depth and instances that it occurs.

```js
gulp.src('src/css/*.css')
  .pipe(cssdepth({
    'depthAllowed': 3,
    'showStats': true
  }));
```

#### Output
```
[15:25:56] CSS Depth Check Report for desktop.css
[15:25:56]
┌────────────────┬───────────┐
│ Selector Depth │ Instances │
├────────────────┼───────────┤
│ 4              │        34 │
├────────────────┼───────────┤
│ 5              │        19 │
├────────────────┼───────────┤
│ 6              │         3 │
├────────────────┼───────────┤
│ 7              │         8 │
└────────────────┴───────────┘
```

#### options.showSelectors
Type: `boolean` Default: `false`

Include affected selectors in the output, requires `showStats` to be enabled.

```js
gulp.src('src/css/*.css')
  .pipe(cssdepth({
    'depthAllowed': 3,
    'showStats': true,
    'showSelectors': true
  }));
```

#### Output
```
[15:25:56] CSS Depth Check Report for desktop.css
[15:25:56]
┌────────────────┬───────────┬─────────────────────────────────────────────────────┐
│ Selector Depth │ Instances │ Selectors                                           │
├────────────────┼───────────┼─────────────────────────────────────────────────────┤
│ 4              │       3   │ .Top-nav .Dropdown-menu li a                        │
│                │           │ .Top-nav .Dropdown-menu li .menuItem-wrapper        │
│                │           │ .Top-nav .Dropdown-menu a .icon                     │
│                │           │ .Top-nav .menu-group:hover .Dropdown-menu           │
└────────────────┴───────────┴─────────────────────────────────────────────────────┘
```

#### options.logFolder
Type: `String` Default: `none`

If log folder is specified, the check will generate JSON file with stats and selector list.

```js
gulp.src('src/css/*.css')
  .pipe(cssdepth({
    'depthAllowed': 3,
    'showStats': true,
    'showSelectors': true,
    'logFolder': 'target/checks'
  }));
```

#### options.throwError
Type: `boolean` Default: `false`

You can set `throwError` to tell gulp that css depth checks validated to error.

```js
gulp.src('src/css/*.css')
  .pipe(cssdepth({
    'depthAllowed': 3,
    'showStats': true,
    'showSelectors': true,
    'logFolder': 'target/checks',
    'throwError': true
  }));
```
