/**
 * 检查浏览器是否支持transition
 * 如果不支持的话，轮播动画使用jQuery的animate方法
 */
export function isLowerBroswer() {
    return 'transition' in document.body.style;
}