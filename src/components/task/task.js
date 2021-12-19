import { useEffect, useState } from "react";
import "./task.css";

const Task = ({
  index,
  task,
  finishEditing,
  startEditing,
  onDelete,
  editable,
  editMode,
}) => {
  const [name, setName] = useState(task?.name || "");
  const [complete, setComplete] = useState(task?.complete);
  const [edit, setEdit] = useState(editMode);

  useEffect(() => {
    setEdit(editMode);
  }, [editMode]);

  useEffect(() => {
    if (task) {
      setName(task?.name || "");
      setComplete(task?.complete);
    }
  }, [task]);

  const onDone = () => {
    finishEditing &&
      finishEditing(
        {
          complete,
          name,
        },
        index
      );
  };
  const onComplete = (completed) => {
    setComplete(completed);
    finishEditing &&
      finishEditing(
        {
          complete: completed,
          name,
        },
        index
      );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      {editable ? (
        edit ? (
          <div className="flow-center">
            <div className="flow-checkbox">
              <input
                type="checkbox"
                checked={complete}
                onChange={() => setComplete(!complete)}
              />
            </div>
            <textarea
              rows={4}
              onChange={(ev) => setName(ev.target.value)}
              onBlur={() => onDone()}
              value={name}
            />
            <div className="flow-button">
              <button onClick={() => onDone()}>Done</button>
            </div>
          </div>
        ) : (
          <div className="flow-center">
            <div className="flow-checkbox">
              <input
                type="checkbox"
                checked={complete}
                onChange={() => onComplete(!complete)}
              />
            </div>
            <div>{name}</div>
            <div className="row flex-end">
              <div
                className="flow-button flow-center"
                onClick={() => startEditing(index)}
              >
                {"✏️"}
              </div>
              <div className="flow-button flow-center">
                <button onClick={() => onDelete(index)}>Delete</button>
              </div>
            </div>
          </div>
        )
      ) : (
        <p>
          <div className="row flow-center">
            {name}
            {complete ? (
              <div className="pencil complete">✔️</div>
            ) : (
              <div className="padding">(In Progress)</div>
            )}
          </div>
        </p>
      )}
    </div>
  );
};

export default Task;
