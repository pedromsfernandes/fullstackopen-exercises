import React from "react";

const Header = ({ course }) => <h1>{course}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Total = ({ parts }) => (
  <p style={{ fontWeight: "bold" }}>
    Total of {parts.reduce((accum, current) => accum + current.exercises, 0)}{" "}
    exercises
  </p>
);

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
);

export default Course;
