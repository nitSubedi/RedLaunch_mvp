import React, { useState, useEffect } from "react";
import { InventoryItem } from "./types";

type RestockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSubmit: (itemId: string, quantity: number) => Promise<void>;
  isLoading: boolean;
};

export default function RestockModal({
  isOpen,
  onClose,
  item,
  onSubmit,
  isLoading,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    setQuantity(0);
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Restock &quot;{item.category}&quot;</h3>
        <div className="form-group">
          <label>Restock Quantity</label>
          <input
            type="number"
            className="form-input"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoading || quantity <= 0}
            onClick={() => onSubmit(item.id, quantity)}
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}