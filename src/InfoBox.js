import React from "react";
import "./infobox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

const InfoBox = ({ title, cases, isRed, total, active, ...props }) => {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infobox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infobox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}{" "}
        </h2>
        <Typography className="infobox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
