import React, { useState, useEffect } from "react";
import { InventoryItem } from "./types";

type LogUsageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSubmit: (itemId: string, quantity: number, notes: string) => Promise<void>;
  isLoading: boolean;
};

export default function LogUsageModal({
  isOpen,
  onClose,
  item,
  onSubmit,
  isLoading,
}: LogUsageModalProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    setQuantity(0);
    setNotes("");
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Usage Log for &quot;{item.category}&quot;</h3>
        <div className="form-group">
          <label>Quantity Used</label>
          <input
            type="number"
            className="form-input"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <input
            type="text"
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoading || quantity <= 0}
            onClick={() => onSubmit(item.id, quantity, notes)}
          >
            Add Usage Log
          </button>
        </div>
      </div>
    </div>
  );
}