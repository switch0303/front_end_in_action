import React from "react";
import { nanoid } from "nanoid";
import { useDrag } from "react-dnd";

import "./Element.scss";

export default function Element({ text, name, schema, actions }) {
    const [{ isDragging }, dragRef] = useDrag({
        type: "box",
        item: {
            $id: `${name}_${nanoid(6)}`,
            schemaItem: schema,
            operateType: "add",
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={dragRef}>
            <div
                className="ele-item"
                style={{ opacity: isDragging ? 0.5 : 1 }}
                onClick={() => {
                    const $id = `${name}_${nanoid(6)}`;
                    actions.addSchema({
                        position: "inside",
                        targetId: "#",
                        item: {
                            $id,
                            schemaItem: schema,
                        },
                    });
                }}
            >
                {text}
            </div>
        </div>
    );
}
