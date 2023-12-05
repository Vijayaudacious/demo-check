import { Task } from "@/Types/Reports";
import { Button } from "antd";
import React, { useState } from "react";
import styles from "./styles.module.less";

interface TaskListProps {
  tasks: Task[];
  max?: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, max = 2 }) => {
  const [showAll, setShowAll] = useState(false);

  const hasTasks = tasks.length > 0;
  const shouldshowReadButton = tasks.length > max;

  return (
    <>
      {!hasTasks && <span>No task</span>}
      {hasTasks && (
        <ol>
          {(showAll ? tasks : tasks.slice(0, max)).map(
            ({ description, id }) => (
              <li key={id} className={styles.description}>{description}</li>
            )
          )}
        </ol>
      )}
      {shouldshowReadButton && (
        <Button
          type="link"
          id="more_less"
          onClick={() => setShowAll(!showAll)}
          color="red"
        >
          <p className={styles.toggleButton}>
            {showAll ? "...less" : "...more"}
          </p>
        </Button>
      )}
    </>
  );
};

export default TaskList;
