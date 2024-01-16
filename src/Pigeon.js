class Pigeon {

    /**
     * @var {SVGElement}
     */
    svg

    /**
     * @var {SVGPathElement}
     */
    path

    /**
     * @var {Position}
     */
    position

    /**
     * @param svg
     * @param {[{value: string|number, key: string}]} additionalAttrs
     */
    constructor(svg, additionalAttrs = []) {
        this.svg = svg
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', 'blue');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '2');

        additionalAttrs.map(v => path.setAttribute(v.key, v.value))

        this.svg.appendChild(path);
        this.position = new Position(50, 570)
        this.setDefault()
    }

    setDefault = () => {
        this.path.setAttribute('d', `M${this.position.x},${this.position.y}`)
    }
}