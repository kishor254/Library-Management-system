import { useState } from "react";
import { useLibrary } from "../context/LibraryStoreContext";

export default function MemberModal({ isOpen, onClose }) {
  const { member, updateMember, borrowedBooks } = useLibrary();

  const [name, setName] = useState(member?.name || "");
  const [email, setEmail] = useState(member?.email || "");
  const [cardTier, setCardTier] = useState(member?.cardTier || "Gold Scholar");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMember({
      name: name.trim() || member.name,
      email: email.trim() || member.email,
      cardTier
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge">MEMBER PROFILE</span>
            <h2>Edit Member Information</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="member-name">Full Name</label>
            <input
              id="member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Vance"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="member-email">University / Library Email</label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex.vance@university.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="member-tier">Membership Tier</label>
            <select
              id="member-tier"
              value={cardTier}
              onChange={(e) => setCardTier(e.target.value)}
            >
              <option value="Standard Reader">Standard Reader (Max 3 Loans)</option>
              <option value="Gold Scholar">Gold Scholar (Max 5 Loans)</option>
              <option value="Platinum Fellow">Platinum Fellow (Max 8 Loans)</option>
            </select>
          </div>

          <div className="member-meta-stats">
            <div>
              <span>Member ID</span>
              <strong>{member?.membershipId || "BN-2026-9812"}</strong>
            </div>
            <div>
              <span>Active Loans</span>
              <strong>{borrowedBooks.length} / {member?.maxLoans || 5}</strong>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes (Dispatches to Store)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
