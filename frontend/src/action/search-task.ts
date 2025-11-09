import { print } from "graphql";
import { SearchTask } from "../query/todo.graphql";
import { graphQLEndpoint, headers } from "../const";

type Task = {
    taskId: string;
    title: string;
    description: string;
  };
  
const addTaskFormEl =
  document.querySelector<HTMLFormElement>("#search-task-form")!;

// submit イベントの割り当て
addTaskFormEl.addEventListener("submit", async function (ev: SubmitEvent) {
  ev.preventDefault();

  const formData = new FormData(addTaskFormEl);
  const title = getTitle(formData);
  const description = getDescription(formData);

  await searchTask(title, description);
  console.log(searchTask(title, description));
});

// title の取得 & 簡易バリデーション
function getTitle(formData: FormData) {
  const title = formData.get("title");
  if (typeof title === "string" && title !== "") {
    return title;
  }
  throw new Error("Please input the `title`.");
}

// description の取得 & 簡易バリデーション
function getDescription(formData: FormData) {
  const description = formData.get("description");
  if (typeof description === "string" && description !== "") {
    return description;
  }
  throw new Error("Please input the `title`.");
}

const searchTask = (title: string, description: string) => (
    fetch(graphQLEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
            query: print(SearchTask),
            variables: {title, description},
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((response: {data?: {taskList: Task[]}}) => {
        if (!response.data) {
            throw new Error("Response data is undefined");
        }
        const {taskList} = response.data;

        taskList.forEach((task) => {
            console.log(task);
        });
    })
    .catch((error) => {
        console.error("Error fetching tasks:", error);
    })
);
