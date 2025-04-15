import { Button } from "antd";

function SaveHandler({ onSave }) {
  return (
    <div className="text-end">
      <Button type="primary" onClick={onSave}>Save Design</Button>
    </div>
  );
}

export default SaveHandler;
