import React, { useState, useRef } from "react";
import { DeleteOutlined, CopyOutlined, DragOutlined } from "@ant-design/icons";
import { useDrag, useDrop } from "react-dnd";

import "./Wrapper.scss";
import { nanoid } from "nanoid";

export default function Wrapper(props) {
    const {
        children,
        id,
        schema: schemaItem,
        isRoot,
        globalState,
        actions,
    } = props;
    const { selectedId } = globalState;
    const isSelected = !isRoot && selectedId === id;

    const [position, setPosition] = useState("inside");

    const boxRef = useRef(null);

    const [{ isDragging }, dragRef, dragPreview] = useDrag({
        type: "box",
        item: { $id: id, schemaItem, operateType: "move" },
        canDrag: () => isSelected,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ canDrop, isOver }, dropRef] = useDrop({
        accept: "box",
        drop: async (item, monitor) => {
            if (canDrop && isOver && item.$id !== id) {
                console.log("position", position);
                console.log("dropItem", item);
                console.log("dropTargetId", id);
                if (item.operateType === "add") {
                    actions.addSchema({
                        position,
                        item,
                        targetId: id,
                    });
                } else if (item.operateType === "move") {
                    actions.moveSchema({
                        position,
                        item,
                        targetId: id,
                    });
                }
            }
        },
        hover: (item, monitor) => {
            // 只检查被hover的最小元素
            const didHover = monitor.isOver({ shallow: true });
            if (didHover) {
                if (isRoot) {
                    setPosition("inside");
                } else {
                    // Determine rectangle on screen
                    const hoverBoundingRect =
                        boxRef.current &&
                        boxRef.current.getBoundingClientRect();
                    // Get vertical middle
                    const hoverMiddleY =
                        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                    // Determine mouse position
                    // const clientOffset = monitor.getClientOffset();
                    const dragOffset = monitor.getSourceClientOffset();
                    // Get pixels to the top
                    const hoverClientY = dragOffset.y - hoverBoundingRect.top;
                    // Only perform the move when the mouse has crossed half of the items height
                    // When dragging downwards, only move when the cursor is below 50%
                    // When dragging upwards, only move when the cursor is above 50%
                    // Dragging downwards
                    if (hoverClientY <= hoverMiddleY) {
                        setPosition("up");
                    }
                    // Dragging upwards
                    if (hoverClientY > hoverMiddleY) {
                        setPosition("down");
                    }
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
        }),
    });

    dragRef(dropRef(boxRef));

    const style = {};
    if (isRoot) {
        style.height = "100%";
        style.padding = "10px";
        style.backgroundColor = "rgb(246, 245, 246)";
        style.border = "1px dashed rgb(119, 119, 119)";
        style.overflow = "auto";
    } else {
        style.padding = "20px";
        style.margin = "10px";
        style.backgroundColor = "#fff";
        style.border = "1px dashed #bbb";
        style.opacity = isDragging ? 0 : 1;
        if (isSelected) {
            style.outline = "2px solid rgb(64, 158, 255)";
            style.cursor = "move";
        }
        if (canDrop && isOver) {
            if (position === "up") {
                style.boxShadow = "0 -3px 0 red";
            } else if (position === "down") {
                style.boxShadow = "0 3px 0 red";
            }
        }
    }

    const handleClick = (e) => {
        e.stopPropagation();
        actions.setSelectedId(id);
    };

    const handleCopySchema = () => {
        console.log("copy");
        actions.addSchema({
            position: "down",
            item: {
                $id: `${id}_${nanoid(6)}`,
                schemaItem,
            },
            targetId: id,
        });
    };

    return (
        <div
            ref={boxRef}
            className="relative"
            style={style}
            onClick={handleClick}
        >
            {children}

            {!isRoot && (
                <div className="absolute top-0 right-1 f7">
                    <span className={"blue"}>{id}</span>
                </div>
            )}

            {isSelected && (
                <div className="pointer-move">
                    <DragOutlined />
                </div>
            )}

            {isSelected && (
                <div className="pointer-wrapper">
                    <div
                        title="删除"
                        className="pointer"
                        onClick={() => {
                            actions.deleteSchema({ $id: id });
                        }}
                    >
                        <DeleteOutlined />
                    </div>
                    <div
                        title="复制"
                        className="pointer"
                        onClick={handleCopySchema}
                    >
                        <CopyOutlined />
                    </div>
                </div>
            )}
        </div>
    );
}
