import {
  deleteClass,
  getIds,
  submit,
  modalButtonProperties,
  loadTableContents,
  checkTableData,
} from "./DersListesiScript";
import React, { useEffect } from "react";

function CourseBody() {
  useEffect(() => {
    // This function will be run when the component is loaded
    modalButtonProperties();
    loadTableContents();
    checkTableData();
  }, []); // The empty array means this useEffect will run once on component mount
  return (
    <>
      <div className="buttons">
        <button type="button" id="open" className="addRow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="addIcon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p>Ders Ekle</p>
        </button>
        <button
          type="button"
          id="delete"
          className="addRow"
          onClick={() => deleteClass(getIds())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="deleteIcon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
          Ders Sil
        </button>
      </div>
      <div className="modal" id="modal">
        <div className="modal-header">
          <button className="close-button" type="button" id="close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            type="kod"
            className="input"
            id="kod"
            placeholder="Dersin Kodunu Girin"
          />
          <input
            type="fakulte"
            className="input"
            id="fakulte"
            placeholder="Fakülteyi Girin"
          />
          <input
            type="zaman"
            className="input"
            id="zaman"
            placeholder="Dersin Gününü ve Saatini Girin"
          />
          <input
            type="sinif"
            className="input"
            id="sinif"
            placeholder="Dersin Gerçekleşeceği Sınıfı Girin"
          />
          <input
            type="ogretici"
            className="input"
            id="ogretici"
            placeholder="İlgili Öğretim Görevlisini Girin"
          />
          <div id="hatali" className="hatali">
            Yanlış Bilgi Girdiniz!
          </div>
          <button
            className="submit-button"
            type="button"
            id="submit"
            onClick={() => submit()}
          >
            Onayla
          </button>
        </div>
      </div>
      <div id="overlay"></div>

      <table className="container">
        <tbody>
          <tr>
            <th className="Checkbox-th"></th>
            <th className="kod-th">Ders Kodu</th>
            <th className="fakulte-th">Fakülte</th>
            <th className="zaman-th">Zaman</th>
            <th className="sinif-th">Sınıf</th>
            <th className="ogretici-th">Öğretim Görevlisi</th>
          </tr>
        </tbody>
      </table>
      <div className="noData">Hiçbir Bilgi Yok.</div>
      <div className="noResponse">
        <div className="noResponseMsg">Bağlantı Sağlanamadı!</div>
      </div>
    </>
  );
}
export default CourseBody;
