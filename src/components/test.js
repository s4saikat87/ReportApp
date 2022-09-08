import React from 'react'
import * as ReactDOM from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import { useDraggable, Icon } from "@progress/kendo-react-common";
const Test = () => {
    const [position, setPosition] = React.useState({
        x: 50,
        y: 50,
      });
      const [pressed, setPressed] = React.useState(false);
      const [dragged, setDragged] = React.useState(false);
      const [initial, setInitial] = React.useState(null);
      const button = React.useRef(null);
      const handlePress = React.useCallback(() => {
        setPressed(true);
      }, []);
      const handleDragStart = React.useCallback(
        (event) => {
          setDragged(true);
          setInitial({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
          });
        },
        [position.x, position.y]
      );
      const handleDrag = React.useCallback(
        (event) => {
          if (!initial) {
            return;
          }
    
          setPosition({
            x: event.clientX - initial.x,
            y: event.clientY - initial.y,
          });
        },
        [initial]
      );
      const handleDragEnd = React.useCallback(() => {
        setDragged(false);
        setInitial(null);
      }, []);
      const handleRelease = React.useCallback(() => {
        setPressed(false);
      }, []);
      useDraggable(button, {
        onPress: handlePress,
        onDragStart: handleDragStart,
        onDrag: handleDrag,
        onDragEnd: handleDragEnd,
        onRelease: handleRelease,
      });
      return (
        <Button
          ref={button}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
          }}
          fillMode={pressed ? "outline" : "flat"}
          themeColor={dragged ? "primary" : undefined}
        >
          <Icon name="move" size="medium" />
          Drag Me!
        </Button>
      );
}

export default Test
