import DailyIframe from "@daily-co/daily-js";
import { child, onValue, set } from "@firebase/database";
import { useEffect, useRef, useState } from "react";
import {
  dailyParticipantInfo,
  makeParticipantUpdateHandler,
} from "../utils/daily";
import { firebaseSlugBase } from "../utils/firebase";
import { getRoomUrl } from "../utils/room";
import "./Call.css";
import Task from "./task";

function Call({ firebaseApp }) {
  const callWrapperEl = useRef(null);
  const [participants, setParticipants] = useState({});

  const callFrame = useRef(null);
  useEffect(() => {
    const roomUrl = getRoomUrl();
    const frame = DailyIframe.createFrame(callWrapperEl.current, {
      url: roomUrl,
    });

    callFrame.current = frame;
    frame.join().then((frameParticipants) => {
      let newParticipants = {};
      for (const [id, participant] of Object.entries(frameParticipants)) {
        newParticipants[id] = dailyParticipantInfo(participant);
      }
      setParticipants(newParticipants);
    });

    frame.on(
      "participant-joined",
      makeParticipantUpdateHandler(setParticipants)
    );
    frame.on(
      "participant-updated",
      makeParticipantUpdateHandler(setParticipants)
    );
    frame.on("participant-left", makeParticipantUpdateHandler(setParticipants));

    return () => {
      callFrame.current.leave();
      callFrame.current.destroy();
    };
  }, []);

  const [currentStatus, setCurrentStatus] = useState([]);
  // const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});

  useEffect(() => {
    const base = firebaseSlugBase();
    const statusesRef = child(base, "user_statuses");
    onValue(statusesRef, (snapshot) => {
      if (snapshot.val()) {
        setUserStatuses(snapshot.val());
      }
    });
  }, []);

  const localParticipant = Object.values(participants).find(
    (participant) => participant.isLocal
  );

  const finishEditing = (task, index) => {
    const base = firebaseSlugBase();
    console.log("task", task);
    // setIsEditingStatus(false);
    setEditingIndex(null);
    if (localParticipant) {
      const newStatus = [...currentStatus];
      newStatus.splice(index, 1, task);
      // console.log("newStatus", newStatus);
      setCurrentStatus(newStatus);
      set(child(base, `user_statuses/${localParticipant.id}`), newStatus);
    }
  };

  const onDelete = (index) => {
    const base = firebaseSlugBase();
    // setIsEditingStatus(false);
    setEditingIndex(null);
    if (localParticipant) {
      const newStatus = [...currentStatus];
      newStatus.splice(index, 1);
      // console.log("newStatus", newStatus);
      setCurrentStatus(newStatus);
      set(child(base, `user_statuses/${localParticipant.id}`), newStatus);
    }
  };

  return (
    <div style={{ height: "100vh", minWidth: "100vh", display: "flex" }}>
      <div
        id="call"
        ref={callWrapperEl}
        style={{ height: "100%", width: "70%" }}
      />
      <div style={{ width: "30%", padding: "10px" }}>
        <h2>Tasks</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <h3>My Tasks</h3>
          <div className="flow-button-div">
            <button
              className="flow-button"
              // style={{ height: "20px", width: "100px" }}
              onClick={() => {
                currentStatus.push({ complete: false, value: "" });
                setEditingIndex(currentStatus?.length - 1);
              }}
            >
              Add Task
            </button>
          </div>
        </div>

        {localParticipant && <p>name: {localParticipant?.name}</p>}

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {currentStatus.map((task, index) => (
            <Task
              editable={true}
              editMode={editingIndex === index ? true : false}
              task={task}
              index={index}
              startEditing={setEditingIndex}
              finishEditing={finishEditing}
              onDelete={onDelete}
            ></Task>
          ))}
        </div>

        <h3>Other Tasks</h3>
        {Object.entries(participants)
          .filter(([_, info]) => info.id !== localParticipant?.id)
          .map(([id, info]) => (
            <div key={id} style={{ border: "1px solid gray" }}>
              <p>
                <strong>name:</strong> {info.name}
              </p>
              <p>
                <strong>Tasks:</strong>
                {!(id in userStatuses) && "<empty>"}
              </p>
              {id in userStatuses &&
                userStatuses[id].map((v, i) => (
                  <Task
                    editable={false}
                    editMode={false}
                    task={v}
                    index={i}
                  ></Task>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Call;
