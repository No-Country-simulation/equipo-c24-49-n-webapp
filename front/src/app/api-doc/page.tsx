import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
const page = () => {
  return (
    <div>
      <SwaggerUI url="swagger.json" />
    </div>
  );
};

export default page;