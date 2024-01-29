// this feeds WorkoutPage

import CommentsSection from "./CommentsSection";
import MarkdownEditor from "./MarkdownEditor";
import WorkoutLink from "./WorkoutLink";
import { Form } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_WORKOUT } from "../utils/mutations";
import { EDIT_WORKOUT } from "../utils/mutations";

const profilePictureStyle = {
  height: "0.5in",
  borderRadius: "0.25in"
};

function Workout({ id, type, title, set, rep, hour, link, notes, comments }) {
  const [inEditMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // These variables are for when the user edits the workout, separate from the actual workout content
  const [editTitle, setEditTitle] = useState(title);

  const [editType, setEditType] = useState(type);
  const [editSet, setEditSet] = useState(set);
  const [editRep, setEditRep] = useState(rep);
  const [editHour, setEditHour] = useState(hour); 
  const [editText, setEditText] = useState(notes);
  const [editLink, setEditLink] = useState(link); 
  const [removeWorkout, { error }] = useMutation(REMOVE_WORKOUT);
  const [editWorkoutMutation, { error2 }] = useMutation(EDIT_WORKOUT);

  const titleInputField = useRef();
  const workoutTypeSelection = useRef();
  const setInputField = useRef();
  const repInputField = useRef();
  const hourInputField = useRef();
  const textDiv = useRef();

  const markdownConverter = new showdown.Converter();

  useEffect(() => {
    titleInputField.current.value = title;
    workoutTypeSelection.current.value = type;
    setInputField.current.value = set;
    repInputField.current.value = rep;
    hourInputField.current.value = hour;

    textDiv.current.innerHTML = markdownConverter.makeHtml(notes);
  }, []);

  function deleteWorkout() {
    removeWorkout({
      variables: { workoutId: id }
    }).then(() => {
      window.location = "/userpage";
    });
  }

  function editWorkout() {
    editWorkoutMutation({
      variables: 
        { workoutId: id, 
        workoutTitle: editTitle, 
        workoutType: editType,
        workoutSet: editSet, 
        workoutRep: editRep,
        workoutHour: editHour,
        workoutText: editText,
        url: editLink.text,
      },
    }).then(() => {
      window.location = "/workout/" + id;
    });
  }


  function resetEdits() {
    setEditTitle(title);
    setEditType(type);
    setEditSet(set);
    setEditRep(rep);
    setEditHour(hour);
    setEditText(notes);
    setEditLink(link);
    titleInputField.current.value = title;
    workoutTypeSelection.current.value = type;
    setInputField.current.value = set;
    repInputField.current.value = rep;
    hourInputField.current.value = hour;
  }

  // ------ NOTE FOR BACKEND --------
  // This is the function is where we implement saving the edits to the server.
  // This function is called when the user wants to save their edits.
  async function onSave() {
    setIsSaving(true);

    // ---- These variables are what the user edited and used for sending a mutate query to the backend -----//
    // ---- If the user hasn't edited, for example, the title, it will be the original -----//
    // ---- If the user has edited, for example, the notes, it will be the edited note ------//
  

    // TODO: Send query to update workout by workoutId
    editWorkout();
  }

  function renderEditButtons() {
    const btnWidth = {
      width: "2.6rem"
    };

    return !inEditMode ? (
      <>
        <button className="btn btn-primary" style={btnWidth} onClick={() => setEditMode(true)}>
          <i className="fa-solid fa-pencil"></i>
        </button>
        <button className="btn btn-danger" style={btnWidth} onClick={() => deleteWorkout()}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </>
    ) : (
      <>
        <button className="btn btn-success" style={btnWidth} onClick={onSave}>
        {
          !isSaving ? (<i className="fa-solid fa-floppy-disk"></i>) :
          (<span class="spinner-border spinner-border-sm" aria-hidden="true"/>)
        }
        </button>
        <button className="btn btn-danger" style={btnWidth} onClick={() => {setEditMode(false); resetEdits();}}>
          <i className="fa-solid fa-ban"></i>
        </button>
      </>
    );
  }

  return (
    <div className="card flex-grow-1 box-shadow col-7">
      <div className="card-header">
        <h4 className="card-title d-flex gap-2 align-items-center mb-0">
          <img style={profilePictureStyle} src="/default-pfp.jpg"></img>
          <span className={inEditMode ? "d-none" : ""}>{ title }</span>
          <input ref={titleInputField} className={!inEditMode ? "d-none" : "form-control"} onInput={() => setEditTitle(titleInputField.current.value)}/>

          <span className="flex-grow-1"></span>

          <div className="justify-self-end d-flex gap-2">
            { renderEditButtons() }
          </div>
        </h4>

        <div className="d-flex gap-2 align-items-center pt-2">
          <span></span>
          
          <span className={`badge bg-secondary rounded-pill p-2 d-inline-flex gap-2 ${inEditMode ? "d-none" : ""}`}>
         
            {type}
          </span>
          <Form.Select className={!inEditMode ? "d-none" : ""} ref={workoutTypeSelection} size="sm" onChange={() => setEditType(workoutTypeSelection.current.value)}>
            <option>Strength</option>
            <option>Meditation</option>
            <option>Yoga</option>
            <option>Cardio</option>
            <option>Cycling</option>
            <option>Outdoor</option>
            <option>Running</option>
            <option>Walking</option> 
            <option>Stretching</option> 
          </Form.Select>
        </div>
      </div>
      <div className="card-body">
        <h5>My Notes:</h5>
        <div className={`markdown-view py-3 ${inEditMode ? 'd-none' : ''}`} ref={textDiv}/>
        <div className={!inEditMode ? 'd-none' : ''}>
          <MarkdownEditor text={editText} setText={setEditText} />
        </div>

        <h5>Set:</h5>
        <div className={`markdown-view py-3 ${inEditMode ? 'd-none' : ''}`} ref={setInputField}/>
        <div className={!inEditMode ? 'd-none' : ''}>
          <MarkdownEditor text={editSet} setText={setEditSet} />
        </div>

        <h5>Rep:</h5>
        <div className={`markdown-view py-3 ${inEditMode ? 'd-none' : ''}`} ref={repInputField}/>
        <div className={!inEditMode ? 'd-none' : ''}>
          <MarkdownEditor text={editRep} setText={setEditRep} />
        </div>

        <h5>Hour:</h5>
        <div className={`markdown-view py-3 ${inEditMode ? 'd-none' : ''}`} ref={hourInputField}/>
        <div className={!inEditMode ? 'd-none' : ''}>
          <MarkdownEditor text={editHour} setText={setEditHour} />
        </div>
      
        <WorkoutLink inEditMode={inEditMode} link={link} editLink={editLink} setEditLink={setEditLink}/>

        <hr/>

        <CommentsSection comments={comments} />
      </div>
    </div>
  )
}

export default Workout;