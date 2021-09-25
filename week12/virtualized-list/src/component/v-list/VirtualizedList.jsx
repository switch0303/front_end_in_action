import React, { Component } from "react";
import PropTypes from "prop-types";

export default class VirtualizedList extends Component {
    constructor(...arg) {
        super(...arg);

        this.scrollContainerRef = React.createRef();
        this.phantomContentRef = React.createRef();
        this.displayContentRef = React.createRef();

        this.height = this.props.height;
        this.rows = this.props.rows;
        this.bufferSize = this.props.bufferSize;
        this.estimatedRowHeight = this.props.estimatedRowHeight;
        this.setVirtualizedParams();
        this.initCachedPositions();
    }

    componentDidMount() {
        if (this.displayContentRef.current && this.rows > 0) {
            this.updateCachedPositions();
        }
        // console.log(this.scrollContainerRef.current);
    }

    componentDidUpdate() {
        if (this.rows !== this.props.rows) {
            this.rows = this.props.rows;
            this.resetVirtualizedParams();
            return;
        }
        if (this.displayContentRef.current && this.rows > 0) {
            this.updateCachedPositions();
        }
    }

    setVirtualizedParams = () => {
        this.limit = Math.ceil(this.height / this.estimatedRowHeight);
        this.originStartIdx = 0;
        this.startIndex = 0;
        this.endIndex = Math.min(
            this.originStartIdx + this.limit + this.bufferSize,
            this.rows - 1
        );
        this.phantomHeight = this.estimatedRowHeight * this.rows;
    };

    resetVirtualizedParams = () => {
        this.originStartIdx = 0;
        this.startIndex = 0;
        this.endIndex = Math.min(
            this.originStartIdx + this.limit + this.bufferSize,
            this.rows - 1
        );
        this.phantomHeight = this.estimatedRowHeight * this.rows;
        this.scrollContainerRef.current.scrollTop = 0;
        this.initCachedPositions();
        this.forceUpdate();
    };

    initCachedPositions = () => {
        const { estimatedRowHeight } = this;
        this.cachedPositions = [];
        this.updatedPositionIndex = {};
        for (let i = 0; i < this.rows; i += 1) {
            this.cachedPositions[i] = {
                index: i,
                height: estimatedRowHeight,
                top: i * estimatedRowHeight,
                bottom: (i + 1) * estimatedRowHeight,
                diffValue: 0,
            };
        }
    };

    updateCachedPositions = () => {
        // 1. 获取显示区域下的所有DOM节点，拿到真实高度，去更新 height 和 bottom
        const childNodes = this.displayContentRef.current.childNodes;
        // console.log(childNodes);
        const startNode = childNodes[0];
        childNodes.forEach((node) => {
            if (node) {
                const index = Number(node.id); // 重要：需要用户在rowRender函数生成的最外层DOM节点传入index作为id
                if (this.updatedPositionIndex[index]) {
                    return;
                }
                const rect = node.getBoundingClientRect();
                const newHeight = rect.height;
                const oldHeight = this.cachedPositions[index].height;
                const newDiffValue = newHeight - oldHeight;

                if (newDiffValue !== 0) {
                    this.cachedPositions[index].height = newHeight;
                    this.cachedPositions[index].bottom += newDiffValue;
                    this.cachedPositions[index].diffValue = newDiffValue;
                }
                this.updatedPositionIndex[index] = true;
            }
        });
        // 2. 从显示区域的第一个节点开始，根据新的高度去依次更新 top 和 bottom
        let startIndex = 0;
        if (startNode) {
            startIndex = Number(startNode.id);
        }
        const cachedPositionsLen = this.cachedPositions.length;
        let cumulativeDiffValue = this.cachedPositions[startIndex].diffValue;
        this.cachedPositions[startIndex].diffValue = 0;

        for (let i = startIndex + 1; i < cachedPositionsLen; i += 1) {
            const item = this.cachedPositions[i];
            item.top = this.cachedPositions[i - 1].bottom;
            item.bottom = item.bottom + cumulativeDiffValue;
            if (item.diffValue !== 0) {
                cumulativeDiffValue += item.diffValue;
                item.diffValue = 0;
            }
        }
        // 3. 更新整个虚拟列表的高度
        const phantomHeight =
            this.cachedPositions[cachedPositionsLen - 1].bottom;
        this.phantomHeight = phantomHeight;
        this.phantomContentRef.current.style.height = `${phantomHeight}px`;
    };

    scrollTo = (scrollTop) => {
        this.scrollContainerRef.current.scrollTop = scrollTop;
    };

    scrollByRowIndex = (rowIndex) => {
        const cachedPositionsLen = this.cachedPositions.length;
        const index = Math.min(rowIndex, cachedPositionsLen - 1);
        this.scrollTo(this.cachedPositions[index].top);
    }

    getTransform = () => {
        return `translate3d(0,${
            this.startIndex >= 1
                ? this.cachedPositions[this.startIndex - 1].bottom
                : 0
        }px,0)`;
    };

    renderDisplayContent = () => {
        const { rowRender } = this.props;
        const content = [];
        for (let i = this.startIndex; i <= this.endIndex; i += 1) {
            content.push(rowRender(i));
        }
        return content;
    };

    binarySearch = (cachedPositions, scrollTop) => {
        let left = 0,
            right = cachedPositions.length - 1,
            mid = 0;
        while (left <= right) {
            mid = left + ((right - left) >> 1);
            const bottom = cachedPositions[mid].bottom;
            if (bottom === scrollTop) {
                return mid;
            } else if (bottom < scrollTop) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left;
    };

    getStartIndex = (scrollTop = 0) => {
        return this.binarySearch(this.cachedPositions, scrollTop);
    };

    onScroll = (e) => {
        if (e.target === this.scrollContainerRef.current) {
            const scrollTop = e.target.scrollTop;
            // console.log("scrollTop", scrollTop);
            const currentStartIndex = this.getStartIndex(scrollTop);
            if (currentStartIndex !== this.originStartIdx) {
                this.originStartIdx = currentStartIndex;
                this.startIndex = Math.max(
                    this.originStartIdx - this.bufferSize,
                    0
                );
                this.endIndex = Math.min(
                    this.originStartIdx + this.limit + this.bufferSize,
                    this.rows - 1
                );
                this.forceUpdate();
            }
        }
    };

    render() {
        const { height, rows } = this.props;

        return (
            <div
                ref={this.scrollContainerRef}
                style={{
                    width: "100%",
                    height,
                    position: "relative",
                    overflowY: "auto",
                }}
                onScroll={this.onScroll}
            >
                <div
                    ref={this.phantomContentRef}
                    style={{ position: "relative", height: this.phantomHeight }}
                />
                <div
                    style={{
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        transform: this.getTransform(),
                    }}
                    ref={this.displayContentRef}
                >
                    {this.renderDisplayContent()}
                </div>
                {rows === 0 && (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        暂无内容
                    </div>
                )}
            </div>
        );
    }
}

VirtualizedList.propTypes = {
    height: PropTypes.number,
    rows: PropTypes.number,
    estimatedRowHeight: PropTypes.number,
    rowRender: PropTypes.func,
    bufferSize: PropTypes.number,
};

VirtualizedList.defaultProps = {
    bufferSize: 5,
};
