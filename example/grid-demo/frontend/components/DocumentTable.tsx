import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { Button, Icon, IconButton } from "@mui/material";

export const ActionsRow: React.FC<{
  selected: { all: boolean; ids: string[] };
}> = ({ selected }) => {
  console.log("selected", selected);
  function onClick() {
    if (!selected.all && !selected.ids.length) alert("action on no items");
    else if (selected.all)
      alert(`action on ALL ITEMS or items ${selected.ids.join(",")}`);
    else alert(`action on items ${selected.ids.join(",")}`);
  }

  return (
    <div
      style={{
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: "center",
        justifyContent: "flex-end",
        display: "flex",
      }}
    >
      <div>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            <Icon className="material-icons" sx={{ color: "white" }}>
              add
            </Icon>
          }
          onClick={onClick}
        >
          Add File to Claims
        </Button>
      </div>
    </div>
  );
};

export function DocumentDate({ value }: { value: string }) {
  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  const hh = (date.getHours() + 24) % 12 || 12;
  const min = `${date.getMinutes() > 9 ? "" : 0}${date.getMinutes()}`;
  const ampm = date.getHours() >= 12 ? "pm" : "am";
  return (
    <>
      {value === null ? (
        <span></span>
      ) : (
        <span
          style={{ color: "#818D96" }}
        >{`${yyyy}-${mm}-${dd} ${hh}:${min} ${ampm}`}</span>
      )}
    </>
  );
}

export function DocumentStatus({ value }: { value: string }) {
  return (
    value && (
      <div
        style={{
          backgroundColor: "#EFF1F1",
          padding: "5px 10px",
          borderRadius: 5,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {value}
      </div>
    )
  );
}

export function DocumentActionsData({ record }: { record: { name: string } }) {
  return (
    <>
      <IconButton
        className="material-icons"
        sx={{ color: "grey" }}
        onClick={() => alert(`Download clicked on ${record.name}`)}
      >
        download
      </IconButton>
      <IconButton
        className="material-icons"
        sx={{ color: "grey" }}
        onClick={() => alert(`View clicked on ${record.name}`)}
      >
        visibility
      </IconButton>
    </>
  );
}

export function DocumentActionsHeader({
  column,
}: {
  column: { label: string };
}) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: "5px",
      }}
    >
      <strong>{column.label}</strong>
      <HomeRepairServiceIcon
        sx={{
          transform: "translateY(-2px)",
        }}
      />
    </div>
  );
}
