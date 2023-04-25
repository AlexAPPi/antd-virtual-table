import e,{memo as t,createElement as o,PureComponent as n,useRef as r,useState as i,useCallback as l,useMemo as s,useEffect as a}from"react";import{ConfigProvider as c,Empty as u,Table as d}from"antd";let h=-1;function f(e=!1){if(-1===h||e){const e=document.createElement("div"),t=e.style;t.width="50px",t.height="50px",t.overflow="scroll",document.body.appendChild(e),h=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return h}function p(e){return"function"==typeof e||e&&"[object Function]"==={}.toString.call(e)}function m(e,...t){for(let o=0;o<t.length;o++){const n=t[o];"function"==typeof n&&n(e),"object"==typeof n&&(n.current=e)}}function g(...e){return t=>m(t,...e)}const v={}.hasOwnProperty;function w(...e){const t=[];for(let e=0;e<arguments.length;e++){const n=arguments[e];if(!n)continue;const r=typeof n;if("string"===r||"number"===r)t.push(n);else if(Array.isArray(n)){if(n.length){const e=w.apply(null,n);e&&t.push(e)}}else if("object"===r){if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]")){t.push(n.toString());continue}for(var o in n)v.call(n,o)&&n[o]&&t.push(o)}}return t.join(" ")}var x=function e(t,o){if(t===o)return!0;if(t&&o&&"object"==typeof t&&"object"==typeof o){if(t.constructor!==o.constructor)return!1;var n,r,i;if(Array.isArray(t)){if((n=t.length)!=o.length)return!1;for(r=n;0!=r--;)if(!e(t[r],o[r]))return!1;return!0}if(t.constructor===RegExp)return t.source===o.source&&t.flags===o.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===o.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===o.toString();if((n=(i=Object.keys(t)).length)!==Object.keys(o).length)return!1;for(r=n;0!=r--;)if(!Object.prototype.hasOwnProperty.call(o,i[r]))return!1;for(r=n;0!=r--;){var l=i[r];if(!e(t[l],o[l]))return!1}return!0}return t!=t&&o!=o};const C="virtial-grid-item",I=({columnIndex:e,data:t,rowIndex:o})=>`${o}:${e}`;const S=t((function(t){const{style:o,column:n,data:r,originalColumnIndex:i,columnIndex:l,rowIndex:s,isScrolling:a}=t,c=r&&r[s],u=n.dataIndex&&c?c[n.dataIndex]:void 0,d=n.onCell&&n.onCell(c,l,a),h=n.render,f=h?h(u,c,l,a):u;return e.createElement("div",{...d,"data-row-index":s,"data-column-index":l,"data-original-column-index":i,style:{...d?.style,...o},className:w(C,d?.className)},f)}),((e,t)=>{if(e.originalColumnIndex!==t.originalColumnIndex||e.columnIndex!==t.columnIndex||e.rowIndex!==t.rowIndex)return!1;if(e.style!==t.style&&!x(e.style,t.style))return!1;const o=t.column.shouldCellUpdate;if(o){const n=e.data;if(!o(t.data,n,t.isScrolling))return!0}return e.data===t.data&&e.column.dataIndex===t.column.dataIndex&&e.column.onCell===t.column.onCell&&e.column.render===t.column.render})),y=({rowCount:e},{rowMetadataMap:t,estimatedRowHeight:o,lastMeasuredRowIndex:n})=>{let r=0;if(n>=e&&(n=e-1),n>=0){const e=t[n];r=e.offset+e.size}return r+(e-n-1)*o},_=({columnCount:e},{columnMetadataMap:t,estimatedColumnWidth:o,lastMeasuredColumnIndex:n})=>{let r=0;if(n>=e&&(n=e-1),n>=0){const e=t[n];r=e.offset+e.size}return r+(e-n-1)*o},R=(e,t,o,n,r,i,l,s,a)=>{const c="column"===e?s:0,u="column"===e?a:0,d="column"===e?t.width:t.height,h=((e,t,o,n)=>{let r,i,l;if("column"===e?(r=n.columnMetadataMap,i=t.columnWidth,l=n.lastMeasuredColumnIndex):(r=n.rowMetadataMap,i=t.rowHeight,l=n.lastMeasuredRowIndex),o>l){let t=0;if(l>=0){const e=r[l];t=e.offset+e.size}for(let e=l+1;e<=o;e++){let o=i(e);r[e]={offset:t,size:o},t+=o}"column"===e?n.lastMeasuredColumnIndex=o:n.lastMeasuredRowIndex=o}return r[o]})(e,t,o,i),f="column"===e?_(t,i):y(t,i),p=Math.max(0,Math.min(f-d+c,h.offset-c)),m=Math.max(0,h.offset+h.size-d+u+l);switch("smart"===n&&(n=r>=m-d&&r<=p+d?"auto":"center"),n){case"start":return p;case"end":return m;case"center":return Math.round(m+(p-m)/2);default:return r>=m&&r<=p?r:m>p||r<m?m:p}},b=(e,t,o,n,r,i,l,s)=>R("column",e,t,o,n,r,i,l,s),M=(e,t,o,n,r,i,l,s)=>R("row",e,t,o,n,r,i,l,s);function T(){return T=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n])}return e},T.apply(this,arguments)}function F(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function O(e,t){return O=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},O(e,t)}var W=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function E(e,t){if(e.length!==t.length)return!1;for(var o=0;o<e.length;o++)if(n=e[o],r=t[o],!(n===r||W(n)&&W(r)))return!1;var n,r;return!0}function P(e,t){var o;void 0===t&&(t=E);var n,r=[],i=!1;return function(){for(var l=[],s=0;s<arguments.length;s++)l[s]=arguments[s];return i&&o===this&&t(l,r)||(n=e.apply(this,l),i=!0,o=this,r=l),n}}var L="object"==typeof performance&&"function"==typeof performance.now?function(){return performance.now()}:function(){return Date.now()};function N(e){cancelAnimationFrame(e.id)}var z=-1;var D=null;function k(e){if(void 0===e&&(e=!1),null===D||e){var t=document.createElement("div"),o=t.style;o.width="50px",o.height="50px",o.overflow="scroll",o.direction="rtl";var n=document.createElement("div"),r=n.style;return r.width="100px",r.height="100px",t.appendChild(n),document.body.appendChild(t),t.scrollLeft>0?D="positive-descending":(t.scrollLeft=1,D=0===t.scrollLeft?"negative":"positive-ascending"),document.body.removeChild(t),D}return D}var A=150,H=function(e){var t=e.columnIndex;return e.data,e.rowIndex+":"+t},j=null,U=null,V=null;function q(e){var t,r=e.getColumnOffset,i=e.getColumnStartIndexForOffset,l=e.getColumnStopIndexForStartIndex,s=e.getColumnWidth,a=e.getEstimatedTotalHeight,c=e.getEstimatedTotalWidth,u=e.getOffsetForColumnAndAlignment,d=e.getOffsetForRowAndAlignment,h=e.getRowHeight,f=e.getRowOffset,p=e.getRowStartIndexForOffset,m=e.getRowStopIndexForStartIndex,g=e.initInstanceProps,v=e.shouldResetStyleCacheOnItemSizeChange,w=e.validateProps;return t=function(e){var t,n;function x(t){var o;return(o=e.call(this,t)||this)._instanceProps=g(o.props,F(o)),o._resetIsScrollingTimeoutId=null,o._outerRef=void 0,o.state={instance:F(o),isScrolling:!1,horizontalScrollDirection:"forward",scrollLeft:"number"==typeof o.props.initialScrollLeft?o.props.initialScrollLeft:0,scrollTop:"number"==typeof o.props.initialScrollTop?o.props.initialScrollTop:0,scrollUpdateWasRequested:!1,verticalScrollDirection:"forward"},o._callOnItemsRendered=void 0,o._callOnItemsRendered=P((function(e,t,n,r,i,l,s,a){return o.props.onItemsRendered({overscanColumnStartIndex:e,overscanColumnStopIndex:t,overscanRowStartIndex:n,overscanRowStopIndex:r,visibleColumnStartIndex:i,visibleColumnStopIndex:l,visibleRowStartIndex:s,visibleRowStopIndex:a})})),o._callOnScroll=void 0,o._callOnScroll=P((function(e,t,n,r,i){return o.props.onScroll({horizontalScrollDirection:n,scrollLeft:e,scrollTop:t,verticalScrollDirection:r,scrollUpdateWasRequested:i})})),o._getItemStyle=void 0,o._getItemStyle=function(e,t){var n,i=o.props,l=i.columnWidth,a=i.direction,c=i.rowHeight,u=o._getItemStyleCache(v&&l,v&&a,v&&c),d=e+":"+t;if(u.hasOwnProperty(d))n=u[d];else{var p=r(o.props,t,o._instanceProps),m="rtl"===a;u[d]=n={position:"absolute",left:m?void 0:p,right:m?p:void 0,top:f(o.props,e,o._instanceProps),height:h(o.props,e,o._instanceProps),width:s(o.props,t,o._instanceProps)}}return n},o._getItemStyleCache=void 0,o._getItemStyleCache=P((function(e,t,o){return{}})),o._onScroll=function(e){var t=e.currentTarget,n=t.clientHeight,r=t.clientWidth,i=t.scrollLeft,l=t.scrollTop,s=t.scrollHeight,a=t.scrollWidth;o.setState((function(e){if(e.scrollLeft===i&&e.scrollTop===l)return null;var t=o.props.direction,c=i;if("rtl"===t)switch(k()){case"negative":c=-i;break;case"positive-descending":c=a-r-i}c=Math.max(0,Math.min(c,a-r));var u=Math.max(0,Math.min(l,s-n));return{isScrolling:!0,horizontalScrollDirection:e.scrollLeft<i?"forward":"backward",scrollLeft:c,scrollTop:u,verticalScrollDirection:e.scrollTop<l?"forward":"backward",scrollUpdateWasRequested:!1}}),o._resetIsScrollingDebounced)},o._outerRefSetter=function(e){var t=o.props.outerRef;o._outerRef=e,"function"==typeof t?t(e):null!=t&&"object"==typeof t&&t.hasOwnProperty("current")&&(t.current=e)},o._resetIsScrollingDebounced=function(){var e,t,n,r;null!==o._resetIsScrollingTimeoutId&&N(o._resetIsScrollingTimeoutId),o._resetIsScrollingTimeoutId=(e=o._resetIsScrolling,t=A,n=L(),r={id:requestAnimationFrame((function o(){L()-n>=t?e.call(null):r.id=requestAnimationFrame(o)}))})},o._resetIsScrolling=function(){o._resetIsScrollingTimeoutId=null,o.setState({isScrolling:!1},(function(){o._getItemStyleCache(-1)}))},o}n=e,(t=x).prototype=Object.create(n.prototype),t.prototype.constructor=t,O(t,n),x.getDerivedStateFromProps=function(e,t){return G(e,t),w(e),null};var C=x.prototype;return C.scrollTo=function(e){var t=e.scrollLeft,o=e.scrollTop;void 0!==t&&(t=Math.max(0,t)),void 0!==o&&(o=Math.max(0,o)),this.setState((function(e){return void 0===t&&(t=e.scrollLeft),void 0===o&&(o=e.scrollTop),e.scrollLeft===t&&e.scrollTop===o?null:{horizontalScrollDirection:e.scrollLeft<t?"forward":"backward",scrollLeft:t,scrollTop:o,scrollUpdateWasRequested:!0,verticalScrollDirection:e.scrollTop<o?"forward":"backward"}}),this._resetIsScrollingDebounced)},C.scrollToItem=function(e){var t=e.align,o=void 0===t?"auto":t,n=e.columnIndex,r=e.rowIndex,i=this.props,l=i.columnCount,s=i.height,h=i.rowCount,f=i.width,p=this.state,m=p.scrollLeft,g=p.scrollTop,v=function(e){if(void 0===e&&(e=!1),-1===z||e){var t=document.createElement("div"),o=t.style;o.width="50px",o.height="50px",o.overflow="scroll",document.body.appendChild(t),z=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return z}();void 0!==n&&(n=Math.max(0,Math.min(n,l-1))),void 0!==r&&(r=Math.max(0,Math.min(r,h-1)));var w=a(this.props,this._instanceProps),x=c(this.props,this._instanceProps)>f?v:0,C=w>s?v:0;this.scrollTo({scrollLeft:void 0!==n?u(this.props,n,o,m,this._instanceProps,C):m,scrollTop:void 0!==r?d(this.props,r,o,g,this._instanceProps,x):g})},C.componentDidMount=function(){var e=this.props,t=e.initialScrollLeft,o=e.initialScrollTop;if(null!=this._outerRef){var n=this._outerRef;"number"==typeof t&&(n.scrollLeft=t),"number"==typeof o&&(n.scrollTop=o)}this._callPropsCallbacks()},C.componentDidUpdate=function(){var e=this.props.direction,t=this.state,o=t.scrollLeft,n=t.scrollTop;if(t.scrollUpdateWasRequested&&null!=this._outerRef){var r=this._outerRef;if("rtl"===e)switch(k()){case"negative":r.scrollLeft=-o;break;case"positive-ascending":r.scrollLeft=o;break;default:var i=r.clientWidth,l=r.scrollWidth;r.scrollLeft=l-i-o}else r.scrollLeft=Math.max(0,o);r.scrollTop=Math.max(0,n)}this._callPropsCallbacks()},C.componentWillUnmount=function(){null!==this._resetIsScrollingTimeoutId&&N(this._resetIsScrollingTimeoutId)},C.render=function(){var e=this.props,t=e.children,n=e.className,r=e.columnCount,i=e.direction,l=e.height,s=e.innerRef,u=e.innerElementType,d=e.innerTagName,h=e.itemData,f=e.itemKey,p=void 0===f?H:f,m=e.outerElementType,g=e.outerTagName,v=e.rowCount,w=e.style,x=e.useIsScrolling,C=e.width,I=this.state.isScrolling,S=this._getHorizontalRangeToRender(),y=S[0],_=S[1],R=this._getVerticalRangeToRender(),b=R[0],M=R[1],F=[];if(r>0&&v)for(var O=b;O<=M;O++)for(var W=y;W<=_;W++)F.push(o(t,{columnIndex:W,data:h,isScrolling:x?I:void 0,key:p({columnIndex:W,data:h,rowIndex:O}),rowIndex:O,style:this._getItemStyle(O,W)}));var E=a(this.props,this._instanceProps),P=c(this.props,this._instanceProps);return o(m||g||"div",{className:n,onScroll:this._onScroll,ref:this._outerRefSetter,style:T({position:"relative",height:l,width:C,overflow:"auto",WebkitOverflowScrolling:"touch",willChange:"transform",direction:i},w)},o(u||d||"div",{children:F,ref:s,style:{height:E,pointerEvents:I?"none":void 0,width:P}}))},C._callPropsCallbacks=function(){var e=this.props,t=e.columnCount,o=e.onItemsRendered,n=e.onScroll,r=e.rowCount;if("function"==typeof o&&t>0&&r>0){var i=this._getHorizontalRangeToRender(),l=i[0],s=i[1],a=i[2],c=i[3],u=this._getVerticalRangeToRender(),d=u[0],h=u[1],f=u[2],p=u[3];this._callOnItemsRendered(l,s,d,h,a,c,f,p)}if("function"==typeof n){var m=this.state,g=m.horizontalScrollDirection,v=m.scrollLeft,w=m.scrollTop,x=m.scrollUpdateWasRequested,C=m.verticalScrollDirection;this._callOnScroll(v,w,g,C,x)}},C._getHorizontalRangeToRender=function(){var e=this.props,t=e.columnCount,o=e.overscanColumnCount,n=e.overscanColumnsCount,r=e.overscanCount,s=e.rowCount,a=this.state,c=a.horizontalScrollDirection,u=a.isScrolling,d=a.scrollLeft,h=o||n||r||1;if(0===t||0===s)return[0,0,0,0];var f=i(this.props,d,this._instanceProps),p=l(this.props,f,d,this._instanceProps),m=u&&"backward"!==c?1:Math.max(1,h),g=u&&"forward"!==c?1:Math.max(1,h);return[Math.max(0,f-m),Math.max(0,Math.min(t-1,p+g)),f,p]},C._getVerticalRangeToRender=function(){var e=this.props,t=e.columnCount,o=e.overscanCount,n=e.overscanRowCount,r=e.overscanRowsCount,i=e.rowCount,l=this.state,s=l.isScrolling,a=l.verticalScrollDirection,c=l.scrollTop,u=n||r||o||1;if(0===t||0===i)return[0,0,0,0];var d=p(this.props,c,this._instanceProps),h=m(this.props,d,c,this._instanceProps),f=s&&"backward"!==a?1:Math.max(1,u),g=s&&"forward"!==a?1:Math.max(1,u);return[Math.max(0,d-f),Math.max(0,Math.min(i-1,h+g)),d,h]},x}(n),t.defaultProps={direction:"ltr",itemData:void 0,useIsScrolling:!1},t}"production"!==process.env.NODE_ENV&&"undefined"!=typeof window&&void 0!==window.WeakSet&&(j=new WeakSet,U=new WeakSet,V=new WeakSet);var G=function(e,t){var o=e.children,n=e.direction,r=e.height,i=e.innerTagName,l=e.outerTagName,s=e.overscanColumnsCount,a=e.overscanCount,c=e.overscanRowsCount,u=e.width,d=t.instance;if("production"!==process.env.NODE_ENV){if("number"==typeof a&&j&&!j.has(d)&&(j.add(d),console.warn("The overscanCount prop has been deprecated. Please use the overscanColumnCount and overscanRowCount props instead.")),"number"!=typeof s&&"number"!=typeof c||U&&!U.has(d)&&(U.add(d),console.warn("The overscanColumnsCount and overscanRowsCount props have been deprecated. Please use the overscanColumnCount and overscanRowCount props instead.")),null==i&&null==l||V&&!V.has(d)&&(V.add(d),console.warn("The innerTagName and outerTagName props have been deprecated. Please use the innerElementType and outerElementType props instead.")),null==o)throw Error('An invalid "children" prop has been specified. Value should be a React component. "'+(null===o?"null":typeof o)+'" was specified.');switch(n){case"ltr":case"rtl":break;default:throw Error('An invalid "direction" prop has been specified. Value should be either "ltr" or "rtl". "'+n+'" was specified.')}if("number"!=typeof u)throw Error('An invalid "width" prop has been specified. Grids must specify a number for width. "'+(null===u?"null":typeof u)+'" was specified.');if("number"!=typeof r)throw Error('An invalid "height" prop has been specified. Grids must specify a number for height. "'+(null===r?"null":typeof r)+'" was specified.')}},$=function(e,t){var o=e.rowCount,n=t.rowMetadataMap,r=t.estimatedRowHeight,i=t.lastMeasuredRowIndex,l=0;if(i>=o&&(i=o-1),i>=0){var s=n[i];l=s.offset+s.size}return l+(o-i-1)*r},K=function(e,t){var o=e.columnCount,n=t.columnMetadataMap,r=t.estimatedColumnWidth,i=t.lastMeasuredColumnIndex,l=0;if(i>=o&&(i=o-1),i>=0){var s=n[i];l=s.offset+s.size}return l+(o-i-1)*r},B=function(e,t,o,n){var r,i,l;if("column"===e?(r=n.columnMetadataMap,i=t.columnWidth,l=n.lastMeasuredColumnIndex):(r=n.rowMetadataMap,i=t.rowHeight,l=n.lastMeasuredRowIndex),o>l){var s=0;if(l>=0){var a=r[l];s=a.offset+a.size}for(var c=l+1;c<=o;c++){var u=i(c);r[c]={offset:s,size:u},s+=u}"column"===e?n.lastMeasuredColumnIndex=o:n.lastMeasuredRowIndex=o}return r[o]},J=function(e,t,o,n){var r,i;return"column"===e?(r=o.columnMetadataMap,i=o.lastMeasuredColumnIndex):(r=o.rowMetadataMap,i=o.lastMeasuredRowIndex),(i>0?r[i].offset:0)>=n?Q(e,t,o,i,0,n):X(e,t,o,Math.max(0,i),n)},Q=function(e,t,o,n,r,i){for(;r<=n;){var l=r+Math.floor((n-r)/2),s=B(e,t,l,o).offset;if(s===i)return l;s<i?r=l+1:s>i&&(n=l-1)}return r>0?r-1:0},X=function(e,t,o,n,r){for(var i="column"===e?t.columnCount:t.rowCount,l=1;n<i&&B(e,t,n,o).offset<r;)n+=l,l*=2;return Q(e,t,o,Math.min(n,i-1),Math.floor(n/2),r)},Y=function(e,t,o,n,r,i,l){var s="column"===e?t.width:t.height,a=B(e,t,o,i),c="column"===e?K(t,i):$(t,i),u=Math.max(0,Math.min(c-s,a.offset)),d=Math.max(0,a.offset-s+l+a.size);switch("smart"===n&&(n=r>=d-s&&r<=u+s?"auto":"center"),n){case"start":return u;case"end":return d;case"center":return Math.round(d+(u-d)/2);default:return r>=d&&r<=u?r:d>u||r<d?d:u}},Z=q({getColumnOffset:function(e,t,o){return B("column",e,t,o).offset},getColumnStartIndexForOffset:function(e,t,o){return J("column",e,o,t)},getColumnStopIndexForStartIndex:function(e,t,o,n){for(var r=e.columnCount,i=e.width,l=B("column",e,t,n),s=o+i,a=l.offset+l.size,c=t;c<r-1&&a<s;)c++,a+=B("column",e,c,n).size;return c},getColumnWidth:function(e,t,o){return o.columnMetadataMap[t].size},getEstimatedTotalHeight:$,getEstimatedTotalWidth:K,getOffsetForColumnAndAlignment:function(e,t,o,n,r,i){return Y("column",e,t,o,n,r,i)},getOffsetForRowAndAlignment:function(e,t,o,n,r,i){return Y("row",e,t,o,n,r,i)},getRowOffset:function(e,t,o){return B("row",e,t,o).offset},getRowHeight:function(e,t,o){return o.rowMetadataMap[t].size},getRowStartIndexForOffset:function(e,t,o){return J("row",e,o,t)},getRowStopIndexForStartIndex:function(e,t,o,n){for(var r=e.rowCount,i=e.height,l=B("row",e,t,n),s=o+i,a=l.offset+l.size,c=t;c<r-1&&a<s;)c++,a+=B("row",e,c,n).size;return c},initInstanceProps:function(e,t){var o=e,n={columnMetadataMap:{},estimatedColumnWidth:o.estimatedColumnWidth||50,estimatedRowHeight:o.estimatedRowHeight||50,lastMeasuredColumnIndex:-1,lastMeasuredRowIndex:-1,rowMetadataMap:{}};return t.resetAfterColumnIndex=function(e,o){void 0===o&&(o=!0),t.resetAfterIndices({columnIndex:e,shouldForceUpdate:o})},t.resetAfterRowIndex=function(e,o){void 0===o&&(o=!0),t.resetAfterIndices({rowIndex:e,shouldForceUpdate:o})},t.resetAfterIndices=function(e){var o=e.columnIndex,r=e.rowIndex,i=e.shouldForceUpdate,l=void 0===i||i;"number"==typeof o&&(n.lastMeasuredColumnIndex=Math.min(n.lastMeasuredColumnIndex,o-1)),"number"==typeof r&&(n.lastMeasuredRowIndex=Math.min(n.lastMeasuredRowIndex,r-1)),t._getItemStyleCache(-1),l&&t.forceUpdate()},n},shouldResetStyleCacheOnItemSizeChange:!1,validateProps:function(e){var t=e.columnWidth,o=e.rowHeight;if("production"!==process.env.NODE_ENV){if("function"!=typeof t)throw Error('An invalid "columnWidth" prop has been specified. Value should be a function. "'+(null===t?"null":typeof t)+'" was specified.');if("function"!=typeof o)throw Error('An invalid "rowHeight" prop has been specified. Value should be a function. "'+(null===o?"null":typeof o)+'" was specified.')}}});process.env.NODE_ENV;class ee extends Z{constructor(e){super(e),this._leftFixedColumnsWidth=0,this._rightFixedColumnsWidth=0,this._firstUnFixedColumn=0,this._firstRightFixedColumn=0,this._updateFixedColumnsVars()}_updateFixedColumnsVars(){const{columnCount:e,columnGetter:t,columnWidth:o}=this.props;this._firstUnFixedColumn=0,this._firstRightFixedColumn=e,this._leftFixedColumnsWidth=0,this._rightFixedColumnsWidth=0,this._lastFixedRenderedContent=void 0,this._lastFixedRenderedRowStartIndex=void 0,this._lastFixedRenderedRowStopIndex=void 0;for(let n=0;n<e;n++){let e=t(n);if("left"!==e.fixed&&!0!==e.fixed)break;this._firstUnFixedColumn++,this._leftFixedColumnsWidth+=o(n)}for(let n=e-1;n>-1;n--){if("right"!==t(n).fixed)break;this._firstRightFixedColumn--,this._rightFixedColumnsWidth+=o(n)}}_renderFixedColumns(e,t,n=!1){const{rerenderFixedColumnOnHorizontalScroll:r,columnWidth:i,rowHeight:l}=this.props;if(!1===r&&!1===n&&this._lastFixedRenderedRowStartIndex===e&&this._lastFixedRenderedRowStopIndex===t&&this._lastFixedRenderedContent)return this._lastFixedRenderedContent;const{children:s,itemData:a,columnCount:c,useIsScrolling:u,itemKey:d=I}=this.props,{isScrolling:h}=this.state,f={},p=t-e+1;if(this._leftFixedColumnsWidth>0||this._rightFixedColumnsWidth>0)for(let t=0;t<p;t++){const n=[],r=[],p=e+t,m=l(p),g=e=>{const t=i(e);return o(s,{key:d({columnIndex:e,data:a,rowIndex:p}),rowIndex:p,columnIndex:e,data:a,isScrolling:u?h:void 0,style:{width:t,height:m}})};for(let e=0;e<this._firstUnFixedColumn;e++){const t=g(e);n.push(t)}for(let e=this._firstRightFixedColumn;e<c;e++){const t=g(e);r.push(t)}(n.length>0||r.length>0)&&(f[p]=[n,r])}return this._lastFixedRenderedRowStartIndex=e,this._lastFixedRenderedRowStopIndex=t,this._lastFixedRenderedContent=f,f}scrollToItem({align:e,rowIndex:t,columnIndex:o}){const{columnCount:n,height:r,rowCount:i,width:l}=this.props,{scrollLeft:s,scrollTop:a}=this.state,{scrollbarSize:c=f()}=this.props;void 0!==o&&(o=Math.max(0,Math.min(o,n-1))),void 0!==t&&(t=Math.max(0,Math.min(t,i-1)));const u=y(this.props,this._instanceProps),d=_(this.props,this._instanceProps)>l?c:0,h=u>r?c:0;this.scrollTo({scrollLeft:void 0!==o?b(this.props,o,e,s,this._instanceProps,h,this._leftFixedColumnsWidth,this._rightFixedColumnsWidth):s,scrollTop:void 0!==t?M(this.props,t,e,a,this._instanceProps,d,this._leftFixedColumnsWidth,this._rightFixedColumnsWidth):a})}render(){const{className:t,columnCount:n,height:r,innerRef:i,innerElementType:l,innerTagName:s,outerElementType:a,outerTagName:c,rowCount:u,direction:d,style:h,width:f,useIsScrolling:m,itemData:g,rowClassName:v,onRow:x,children:C,rowKey:S,itemKey:R=I}=this.props,{isScrolling:b}=this.state,M={},T={};let F;if(n>0&&u>0){const[e,t]=this._getHorizontalRangeToRender(),[n,r]=this._getVerticalRangeToRender();F=this._renderFixedColumns(n,r);for(let i=n;i<=r;i++){const n=g[i],r=v?v(n,i):void 0,l=x?x(n,i):void 0,s=p(S)?S(n):S??`${i}`,a=this._getItemStyle(i,this._firstUnFixedColumn),c=this._firstUnFixedColumn,u=this._firstRightFixedColumn,d=[];for(let n=e;n<=t;n++){if(n<c||n>u-1)continue;const e=R({columnIndex:n,data:g,rowIndex:i}),t=this._getItemStyle(i,n);d[n]=o(C,{columnIndex:n,data:g,isScrolling:m?b:void 0,key:e,rowIndex:i,style:t})}M[i]=d,T[i]={...l,key:s,style:{...l?.style,top:a.top},className:w("virtial-grid-row",r,l?.className)}}}const O=y(this.props,this._instanceProps),W=_(this.props,this._instanceProps),E=Object.entries(T).map((([t,o])=>{const{top:n,left:r}=o.style||{},i=F?F[t]:[],l=i[0],s=i[1],a=Object.values(M[t]);return e.createElement("div",{...o},a,e.createElement("div",{className:"fixed-virtial-grid-row-columns",style:{top:n,left:r,width:W}},l&&l.length>0&&e.createElement("div",{className:"fixed-virtial-grid-row-left-columns"},l),s&&s.length>0&&e.createElement("div",{className:"fixed-virtial-grid-row-right-columns"},s)))})),P=this._leftFixedColumnsWidth>0,L=this._rightFixedColumnsWidth>0;return o(a||c||"div",{className:w(t,{"has-fixed-left-column":P,"has-fixed-right-column":L}),onScroll:this._onScroll,ref:this._outerRefSetter,style:{position:"relative",height:r,width:f,overflow:"auto",WebkitOverflowScrolling:"touch",willChange:"transform",direction:d,...h}},o(l||s||"div",{children:E,ref:i,style:{height:O,pointerEvents:b?"none":void 0,width:W}}))}componentDidUpdate(e,t,o){e.columnGetter===this.props.columnGetter&&e.columnCount===this.props.columnCount&&e.columnWidth===this.props.columnWidth||this._updateFixedColumnsVars(),super.componentDidUpdate(e,t,o)}}const te=t=>{const{ref:o,dataSource:n,className:h,columns:f,rowHeight:v,scroll:x,gridRef:C,outerGridRef:I,onScroll:y,onChange:_,components:R,locale:b,showHeader:M,rerenderFixedColumnOnHorizontalScroll:T,...F}=t,O=r(null),W=r(null),[E]=i((()=>({get scrollLeft(){return W.current?W.current?.state.scrollLeft:0},set scrollLeft(e){if(W.current){if(W.current.state.scrollLeft==e)return;W.current.scrollTo({scrollLeft:e})}}}))),P=l(((e,t=-1)=>{if(!1!==M&&!R?.header&&e){const o=e.querySelector(".ant-table .ant-table-header");if(o){const e=o.querySelectorAll(".ant-table-thead .ant-table-cell");-1!==t?o.style.maxWidth=`${t}px`:o.style.removeProperty("maxWidth");let n=0,r=0;for(let t=0;t<e.length;t++){const o=e[t];if(!o.classList.contains("ant-table-cell-fix-left"))break;{const e=o.getBoundingClientRect().width;o.style.left=`${n}px`,n+=e}}for(let t=e.length-1;t>-1;t--){const o=e[t];if(!o.classList.contains("ant-table-cell-fix-right"))break;{const e=o.getBoundingClientRect().width;o.style.right=`${r}px`,r+=e}}}}}),[R?.header,M]),L=l(((e=0,t=0)=>{x.scrollToFirstRowOnChange&&(E.scrollLeft=0),W.current?.resetAfterIndices({columnIndex:e,rowIndex:t,shouldForceUpdate:!0}),P(O.current)}),[x.scrollToFirstRowOnChange,E,P]),N=l(((e,t,o,n)=>{_&&_(e,t,o,n),x.scrollToFirstRowOnChange?L():P(O.current)}),[x.scrollToFirstRowOnChange,_,L,P]),[z,D,k,A]=s((()=>{let t=0;const o=[],n=[];f.forEach(((e,r)=>{t>1?t--:(t=e.overlap??0,o.push(e),n.push(r))}));return[o,n,e=>o[e],t=>{const{columnIndex:r}=t,i=n[r],l=o[r];return e.createElement(S,{...t,originalColumnIndex:i,column:l})}]}),[f]),H=s((()=>p(v)?v:()=>v),[v]),{renderEmpty:j}=e.useContext(c.ConfigContext),U=s((()=>{const t=b&&b.emptyText||j?.("Table")||e.createElement(u,{image:u.PRESENTED_IMAGE_SIMPLE}),o="function"==typeof t?t():t;return e.createElement("div",{className:"virtual-grid-empty"},o)}),[b?.emptyText,j]),V=l(((t,o)=>{const{ref:n,scrollbarSize:r,onScroll:i}=o;m(E,n);const l=e=>H(t[e]),s=function(e,t,o){if(o<0)return 0;if(p(e)){let t=0;for(;o>-1;o--)t+=e(o);return t}return o*e}(l,0,t.length-1),a=e=>{const t=z[e],{width:o,overlap:n}=t;if(n&&n>0){let t=o,i=D[e];for(let e=1;e<n;e++)i++,t+=f[i].width;return i===f.length-1?t-r:t}return s>=x.y&&e===z.length-1?o-r:o},c=function(e,t){if(t<0)return 0;if(p(e)){let o=0;for(;t-- >0;)o+=e(t);return o}return e+t*e}(a,z.length-1),u=s>=x.y?r:0;P(O.current,c+u);const d=t.length>0;return e.createElement("div",{className:"virtual-grid-wrap"},!d&&U,e.createElement(ee,{useIsScrolling:!0,ref:g(C,W),outerRef:g(I),className:"virtual-grid",rerenderFixedColumnOnHorizontalScroll:T,estimatedColumnWidth:c/z.length,estimatedRowHeight:s/t.length,width:x.x,height:x.y,columnCount:z.length,rowCount:t.length,rowHeight:l,columnWidth:a,itemData:t,columnGetter:k,onScroll:e=>{i&&i({scrollLeft:e.scrollLeft}),y&&y(e)}},A))}),[P,H,T,D,z,f,x.x,x.y,k,y,A,U]);return a((()=>{P(O.current)}),[P,x.x,x.y,x.scrollToFirstRowOnChange,f,M,R?.header]),e.createElement(d,{...F,ref:e=>{m(e,o,O),P(e)},locale:b,showHeader:M,className:w("virtual-table",h),columns:f,dataSource:n,scroll:x,components:{...R,body:V},onChange:N})};export{ee as Grid,te as VirtualTable,te as default};
//# sourceMappingURL=index.js.map
