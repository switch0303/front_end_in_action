import React from "react";
import { nanoid } from "nanoid";
import { useDrag } from "react-dnd";

import "./Element.scss";

export default function Element({ text, name, schema, actions }) {
    const [{ isDragging }, dragRef] = useDrag({
        type: "box",
        item: {
            dragItem: {
                parent: "#",
                schema,
                children: [],
            },
            $id: `#/${name}_${nanoid(6)}`,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={dragRef}>
            <div
                className="ele-item"
                onClick={() => {
                    actions.addSchema({
                        [`${name}_${nanoid(6)}`]: schema
                    })
                }}
            >
                {text}
            </div>
        </div>
    );
}
