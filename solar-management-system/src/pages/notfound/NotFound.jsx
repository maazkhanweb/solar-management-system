function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#F8FAFC",
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          color: "#0F766E",
          margin: "0",
        }}
      >
        404
      </h1>

      <h2
        style={{
          marginTop: "10px",
          color: "#1E293B",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          color: "#64748B",
        }}
      >
        Sorry, the page you are looking for doesn't exist.
      </p>
    </div>
  );
}

export default NotFound;