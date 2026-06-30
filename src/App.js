import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const ADMIN_PASSWORD = "garage2024"; // ここを好きなパスワードに変更してください

function Badge({ text, color }) {
  return (
    <span style={{
      background: `${color}22`,
      color: color,
      fontSize: "10px", fontWeight: "800",
      padding: "3px 10px", borderRadius: "20px",
      letterSpacing: "1px", border: `1px solid ${color}44`,
    }}>{text}</span>
  );
}

function CarCard({ car, onClick }) {
  const img = car.images && car.images[0] ? car.images[0] : null;
  return (
    <div
      onClick={() => onClick(car)}
      style={{
        background: "linear-gradient(145deg, #1a1f2e, #141820)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px", overflow: "hidden",
        cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ position: "relative", background: "#0a0d12" }}>
        {img ? (
          <img src={img} alt={car.name} style={{ width: "100%", height: "190px", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "190px", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: "13px" }}>画像なし</div>
        )}
        <div style={{ position: "absolute", top: "10px", left: "10px" }}>
          {car.tag && <Badge text={car.tag} color={car.tag_color || "#f59e0b"} />}
        </div>
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          color: "#4ade80", fontSize: "10px", fontWeight: "600",
          padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(74,222,128,0.3)",
        }}>● {car.status}</div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: "10px", color: "#666", marginBottom: "2px" }}>{car.year} ／ {car.mileage}</div>
        <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff", marginBottom: "1px" }}>{car.name_jp}</div>
        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "12px" }}>{car.name} {car.grade}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "10px", color: "#666" }}>支払総額（税込）</div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#f59e0b" }}>¥{car.price}</div>
          </div>
          <div style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#f59e0b", fontSize: "11px", fontWeight: "600",
            padding: "6px 12px", borderRadius: "6px",
          }}>詳細 →</div>
        </div>
      </div>
    </div>
  );
}

function CarDetail({ car, onBack }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = car.images || [];
  const specs = car.specs || [];
  const equipment = car.equipment || [];

  return (
    <div>
      <button onClick={onBack} style={{
        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff", padding: "8px 16px", borderRadius: "8px",
        cursor: "pointer", fontSize: "13px", marginBottom: "18px",
      }}>← 一覧に戻る</button>

      <div style={{ background: "#111520", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "16px" }}>
        {images.length > 0 ? (
          <img src={images[activeImg]} alt="car" style={{ width: "100%", maxHeight: "320px", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>画像なし</div>
        )}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: "8px", padding: "10px", flexWrap: "wrap" }}>
            {images.map((img, i) => (
              <img key={i} src={img} onClick={() => setActiveImg(i)}
                style={{
                  width: "70px", height: "48px", objectFit: "cover", borderRadius: "6px",
                  border: `2px solid ${activeImg === i ? "#f59e0b" : "rgba(255,255,255,0.15)"}`,
                  cursor: "pointer", opacity: activeImg === i ? 1 : 0.55,
                }} alt="" />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
          {car.tag && <Badge text={car.tag} color={car.tag_color || "#f59e0b"} />}
          <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: "600" }}>● {car.status}</span>
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#fff", margin: "0 0 2px" }}>{car.name_jp}</h2>
        <p style={{ color: "#94a3b8", margin: "0", fontSize: "12px" }}>{car.year} ／ {car.color} ／ {car.mileage}</p>
      </div>

      <div style={{
        background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: "10px", padding: "14px 16px", marginBottom: "14px",
      }}>
        <div style={{ fontSize: "10px", color: "#888", marginBottom: "2px" }}>支払総額（税込）</div>
        <div style={{ fontSize: "30px", fontWeight: "900", color: "#f59e0b" }}>¥{car.price}<span style={{ fontSize: "14px", fontWeight: "400", color: "#888", marginLeft: "4px" }}>円</span></div>
        <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>車検：{car.inspection}</div>
      </div>

      {car.notes && (
        <div style={{
          fontSize: "13px", color: "#aaa", lineHeight: "1.75",
          background: "rgba(255,255,255,0.03)", borderRadius: "8px",
          padding: "12px 14px", marginBottom: "14px",
          borderLeft: "3px solid rgba(245,158,11,0.5)",
        }}>{car.notes}</div>
      )}

      {specs.length > 0 && (
        <div style={{ background: "#111520", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "14px" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", textTransform: "uppercase" }}>車両スペック</div>
          {specs.map(([k, v], i) => (
            <div key={k + i} style={{
              display: "flex", padding: "9px 16px",
              borderBottom: i < specs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
            }}>
              <span style={{ width: "110px", flexShrink: 0, color: "#666", fontSize: "12px" }}>{k}</span>
              <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {equipment.length > 0 && (
        <div style={{ background: "#111520", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "14px" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#94a3b8", textTransform: "uppercase" }}>装備・オプション</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "14px" }}>
            {equipment.map(eq => (
              <span key={eq} style={{
                background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                color: "#93c5fd", fontSize: "12px", padding: "5px 12px", borderRadius: "20px",
              }}>✓ {eq}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{
        background: "linear-gradient(135deg, rgba(6,199,85,0.1), rgba(6,199,85,0.04))",
        border: "1px solid rgba(6,199,85,0.25)",
        borderRadius: "12px", padding: "18px",
      }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "3px" }}>この車両についてお問い合わせ</div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "14px" }}>LINEまたはお電話にてお気軽にご連絡ください</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href="https://lin.ee/OjuOW3L" style={{
            background: "#06c755", borderRadius: "8px",
            color: "#fff", padding: "11px 22px", fontSize: "14px",
            fontWeight: "700", cursor: "pointer", textDecoration: "none",
            display: "inline-block",
          }}>💬 LINEで問い合わせる</a>
        </div>
      </div>
    </div>
  );
}

// ====================== 管理画面フォーム ======================
function emptySpecs() {
  return [["年式", ""], ["グレード", ""], ["エンジン", ""], ["ミッション", ""], ["駆動", ""], ["燃料", ""], ["乗車定員", ""], ["ドア数", ""], ["走行距離", ""], ["車検", ""]];
}

function AdminForm({ existingCar, onSaved, onCancel }) {
  const [form, setForm] = useState(existingCar || {
    name: "", name_jp: "", grade: "", year: "", price: "", mileage: "",
    color: "", inspection: "", status: "在庫あり", tag: "", tag_color: "#f59e0b",
    notes: "", images: [], specs: emptySpecs(), equipment: [],
  });
  const [uploading, setUploading] = useState(false);
  const [equipInput, setEquipInput] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateSpec = (i, idx, val) => {
    const newSpecs = [...form.specs];
    newSpecs[i][idx] = val;
    update("specs", newSpecs);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const newUrls = [];
    for (const file of files) {
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
      const { error } = await supabase.storage.from("car-images").upload(fileName, file);
      if (error) {
        alert("画像アップロードエラー: " + error.message);
        continue;
      }
      const { data } = supabase.storage.from("car-images").getPublicUrl(fileName);
      newUrls.push(data.publicUrl);
    }
    update("images", [...(form.images || []), ...newUrls]);
    setUploading(false);
  };

  const removeImage = (idx) => {
    update("images", form.images.filter((_, i) => i !== idx));
  };

  const addEquipment = () => {
    if (equipInput.trim()) {
      update("equipment", [...(form.equipment || []), equipInput.trim()]);
      setEquipInput("");
    }
  };

  const removeEquipment = (idx) => {
    update("equipment", form.equipment.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.name_jp || !form.price) {
      alert("車名（日本語）と価格は必須です");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    delete payload.id;
    delete payload.created_at;

    let error;
    if (existingCar && existingCar.id) {
      ({ error } = await supabase.from("cars").update(payload).eq("id", existingCar.id));
    } else {
      ({ error } = await supabase.from("cars").insert(payload));
    }
    setSaving(false);
    if (error) {
      alert("保存エラー: " + error.message);
    } else {
      onSaved();
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px",
    color: "#fff", fontSize: "13px", outline: "none", marginBottom: "10px",
  };
  const labelStyle = { fontSize: "11px", color: "#888", marginBottom: "4px", display: "block" };

  return (
    <div>
      <button onClick={onCancel} style={{
        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff", padding: "8px 16px", borderRadius: "8px",
        cursor: "pointer", fontSize: "13px", marginBottom: "18px",
      }}>← キャンセル</button>

      <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px" }}>{existingCar ? "車両を編集" : "新しい車両を追加"}</h2>

      {/* 画像アップロード */}
      <div style={{ background: "#111520", borderRadius: "12px", padding: "16px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
        <label style={labelStyle}>📷 車両写真（複数選択可）</label>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ ...inputStyle, padding: "8px" }} />
        {uploading && <div style={{ color: "#f59e0b", fontSize: "12px" }}>アップロード中...</div>}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
          {(form.images || []).map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img} alt="" style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
              <button onClick={() => removeImage(i)} style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#ef4444", border: "none", borderRadius: "50%",
                color: "#fff", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer",
              }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* 基本情報 */}
      <div style={{ background: "#111520", borderRadius: "12px", padding: "16px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
        <label style={labelStyle}>車名（日本語）*</label>
        <input style={inputStyle} value={form.name_jp} onChange={e => update("name_jp", e.target.value)} placeholder="例：トヨタ プリウス" />

        <label style={labelStyle}>車名（英語）</label>
        <input style={inputStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="例：Toyota Prius" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>グレード</label>
            <input style={inputStyle} value={form.grade} onChange={e => update("grade", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>年式</label>
            <input style={inputStyle} value={form.year} onChange={e => update("year", e.target.value)} placeholder="2020年式" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>価格（円）*</label>
            <input style={inputStyle} value={form.price} onChange={e => update("price", e.target.value)} placeholder="498,000" />
          </div>
          <div>
            <label style={labelStyle}>走行距離</label>
            <input style={inputStyle} value={form.mileage} onChange={e => update("mileage", e.target.value)} placeholder="50,000km" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>カラー</label>
            <input style={inputStyle} value={form.color} onChange={e => update("color", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>車検</label>
            <input style={inputStyle} value={form.inspection} onChange={e => update("inspection", e.target.value)} placeholder="令和8年3月" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>タグ（例：HYBRID, 軽自動車）</label>
            <input style={inputStyle} value={form.tag} onChange={e => update("tag", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>ステータス</label>
            <select style={inputStyle} value={form.status} onChange={e => update("status", e.target.value)}>
              <option value="在庫あり">在庫あり</option>
              <option value="商談中">商談中</option>
              <option value="成約済み">成約済み</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>コメント・アピールポイント</label>
        <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={form.notes} onChange={e => update("notes", e.target.value)} />
      </div>

      {/* スペック */}
      <div style={{ background: "#111520", borderRadius: "12px", padding: "16px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
        <label style={labelStyle}>📋 車両スペック</label>
        {form.specs.map((spec, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input style={{ ...inputStyle, marginBottom: 0, width: "100px", flexShrink: 0 }} value={spec[0]} onChange={e => updateSpec(i, 0, e.target.value)} />
            <input style={{ ...inputStyle, marginBottom: 0 }} value={spec[1]} onChange={e => updateSpec(i, 1, e.target.value)} />
          </div>
        ))}
      </div>

      {/* 装備 */}
      <div style={{ background: "#111520", borderRadius: "12px", padding: "16px", marginBottom: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
        <label style={labelStyle}>🔧 装備・オプション</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <input style={{ ...inputStyle, marginBottom: 0 }} value={equipInput} onChange={e => setEquipInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addEquipment()} placeholder="例：ETC（Enterで追加）" />
          <button onClick={addEquipment} style={{
            background: "#f59e0b", border: "none", borderRadius: "8px",
            color: "#000", padding: "0 16px", cursor: "pointer", fontWeight: "700",
          }}>追加</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(form.equipment || []).map((eq, i) => (
            <span key={i} style={{
              background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
              color: "#93c5fd", fontSize: "12px", padding: "5px 10px", borderRadius: "20px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              {eq}
              <span onClick={() => removeEquipment(i)} style={{ cursor: "pointer", color: "#ef4444" }}>×</span>
            </span>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{
        width: "100%", background: "#f59e0b", border: "none", borderRadius: "10px",
        color: "#000", padding: "14px", fontSize: "15px", fontWeight: "800",
        cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1,
      }}>{saving ? "保存中..." : "💾 保存する"}</button>
    </div>
  );
}

function AdminPanel({ cars, onRefresh, onExit }) {
  const [view, setView] = useState("list"); // list | new | edit
  const [editingCar, setEditingCar] = useState(null);

  const handleDelete = async (car) => {
    if (!window.confirm(`${car.name_jp} を削除しますか？`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", car.id);
    if (error) alert("削除エラー: " + error.message);
    else onRefresh();
  };

  if (view === "new") {
    return <AdminForm onSaved={() => { setView("list"); onRefresh(); }} onCancel={() => setView("list")} />;
  }
  if (view === "edit") {
    return <AdminForm existingCar={editingCar} onSaved={() => { setView("list"); onRefresh(); }} onCancel={() => setView("list")} />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800" }}>🔧 管理画面</h2>
        <button onClick={onExit} style={{
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px",
        }}>サイトに戻る</button>
      </div>

      <button onClick={() => setView("new")} style={{
        width: "100%", background: "#f59e0b", border: "none", borderRadius: "10px",
        color: "#000", padding: "14px", fontSize: "14px", fontWeight: "800",
        cursor: "pointer", marginBottom: "18px",
      }}>＋ 新しい車両を追加</button>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {cars.map(car => (
          <div key={car.id} style={{
            background: "#111520", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "10px", padding: "12px", display: "flex",
            alignItems: "center", gap: "12px",
          }}>
            {car.images && car.images[0] ? (
              <img src={car.images[0]} alt="" style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />
            ) : (
              <div style={{ width: "60px", height: "45px", background: "#222", borderRadius: "6px" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{car.name_jp}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>¥{car.price} ／ {car.status}</div>
            </div>
            <button onClick={() => { setEditingCar(car); setView("edit"); }} style={{
              background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)",
              color: "#93c5fd", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer",
            }}>編集</button>
            <button onClick={() => handleDelete(car)} style={{
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer",
            }}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  return (
    <div style={{ maxWidth: "320px", margin: "60px auto", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔒</div>
      <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>管理者ログイン</h2>
      <input
        type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
        onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PASSWORD ? onLogin() : setError(true))}
        placeholder="パスワード" style={{
          width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)",
          border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: "8px",
          color: "#fff", fontSize: "14px", outline: "none", marginBottom: "10px", textAlign: "center",
        }}
      />
      {error && <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "10px" }}>パスワードが違います</div>}
      <button onClick={() => pw === ADMIN_PASSWORD ? onLogin() : setError(true)} style={{
        width: "100%", background: "#f59e0b", border: "none", borderRadius: "8px",
        color: "#000", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
      }}>ログイン</button>
    </div>
  );
}

export default function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("site"); // site | adminLogin | admin
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
    if (!error) setCars(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
    if (window.location.hash === "#admin") {
      setMode(isAdmin ? "admin" : "adminLogin");
    }
  }, []); // eslint-disable-line

  const filtered = cars.filter(c =>
    (c.name_jp || "").includes(search) ||
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.color || "").includes(search) ||
    (c.tag || "").includes(search)
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      fontFamily: "'Hiragino Kaku Gothic Pro', 'Meiryo', 'Noto Sans JP', sans-serif",
      color: "#fff",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #444; }
        a:hover, button:hover { opacity: 0.85; }
      `}</style>

      <div style={{
        background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => { setMode("site"); setSelectedCar(null); window.location.hash = ""; }}>
          <div style={{ fontSize: "22px" }}>🚗</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "800" }}>在庫車両一覧</div>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px" }}>AUTO GALLERY</div>
          </div>
        </div>
        <div style={{
          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
          color: "#f59e0b", fontSize: "11px", fontWeight: "700",
          padding: "4px 12px", borderRadius: "20px",
        }}>{cars.length}台掲載中</div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 14px" }}>
        {mode === "adminLogin" && (
          <AdminLogin onLogin={() => { setIsAdmin(true); setMode("admin"); }} />
        )}

        {mode === "admin" && isAdmin && (
          <AdminPanel cars={cars} onRefresh={fetchCars} onExit={() => { setMode("site"); window.location.hash = ""; }} />
        )}

        {mode === "site" && (
          selectedCar ? (
            <CarDetail car={selectedCar} onBack={() => setSelectedCar(null)} />
          ) : (
            <>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍  車名・カラーで検索..."
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "#fff", fontSize: "14px",
                  marginBottom: "18px", outline: "none",
                }}
              />
              {loading ? (
                <div style={{ textAlign: "center", color: "#555", padding: "60px 0" }}>読み込み中...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", color: "#444", padding: "60px 0", fontSize: "14px" }}>
                  該当する車両が見つかりません
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "16px" }}>
                  {filtered.map(car => <CarCard key={car.id} car={car} onClick={setSelectedCar} />)}
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button onClick={() => setMode(isAdmin ? "admin" : "adminLogin")} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#555", padding: "6px 16px", borderRadius: "20px",
                  fontSize: "11px", cursor: "pointer",
                }}>🔧 管理画面</button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
