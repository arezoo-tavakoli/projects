import { Link, Outlet, useNavigate, useParams} from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock";
import { deleteEvent, queryClient } from "../../util/http";
import  Modal  from "../UI/Modal";
import { useState } from "react";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });



  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      navigate("/events");
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: none,
      });
    },
  });

  function handleStartDelete () {
    setIsDeleting(true);
  }

  function handleStopDelete () {
    setIsDeleting(false);
  }

  function HandleDelete() {
    mutate({ id: params.id });
  }

  let content;
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching data ...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message || "Failed to fetch data, please try again "
          }
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>
            Do you really want to delete this event?This action can not be
            undone.
          </p>
          <div className="form-actions">
            {isPendingDeletion && <p>Deleting, Please wait ...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className="button-text">
                  Cancel
                </button>
                <button onClick={HandleDelete} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock
              title="Failed to delete event"
              message={
                deleteError.info?.message ||
                "Failed to delete, Please try Later."
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
