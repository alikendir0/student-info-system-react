import {
  deleteStudent,
  getIds,
  submit,
  checkCheckBoxes,
  resetClasses,
  modalSubmit,
  checkTableData,
  modalButtonProperties,
  assignmentModalButtonProperties,
  loadTableContents,
  killButtonDetector,
  buttonDetector,
} from "./OgrenciListesiScript";
import React, { useEffect } from "react";

function StudentBody() {
  useEffect(() => {
    checkTableData();
    modalButtonProperties();
    assignmentModalButtonProperties();
    loadTableContents();
    killButtonDetector();
    buttonDetector();
  }, []);

  return (
    <>
      <div>
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
            Öğrenci Ekle
          </button>
          <button
            type="button"
            id="delete"
            className="addRow"
            onClick={() => deleteStudent(getIds())}
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
            Öğrenci Sil
          </button>
          <button type="button" id="a-open" className="assignBtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="assignIcon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
              />
            </svg>
            <div className="ders-atama">Ders Atama</div>
          </button>

          <button
            type="button"
            id="reset"
            className="addRow"
            onClick={() => resetClasses()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="resetIcon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Dersleri Sıfırla
          </button>
        </div>
        <div className="modal" id="modal">
          <div className="modal-header">
            <button className="close-button" type="button" id="close">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <input type="ad" className="input" id="ad" placeholder="Ad Girin" />
            <input
              type="soyad"
              className="input"
              id="soyad"
              placeholder="Soyad Girin"
            />
            <input
              type="tcNo"
              className="input"
              id="tcNo"
              placeholder="T.C. Numarasını Girin"
            />
            <input
              type="ogrenciNo"
              className="input"
              id="ogrenciNo"
              placeholder="Ögrenci Numarasını Girin"
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
      </div>
      <div className="a-modal" id="a-modal">
        <div className="modal-header">
          <button className="close-button" type="button" id="a-close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div id="a-hatali" className="hatali">
            Yanlış Bilgi Girdiniz!
          </div>
          <table className="a-container">
            <tbody>
              <tr>
                <th className="Checkbox-th"></th>
                <th className="ders-th">Ders Kodu</th>
                <th className="fakulte-th">Fakülte</th>
                <th className="zaman-th">Zaman</th>
                <th className="sinif-th">Sınıf</th>
                <th className="ogretici-th">Öğretim Görevlisi</th>
              </tr>
            </tbody>
          </table>
          <button
            className="submit-button"
            type="button"
            id="submit"
            onClick={() => modalSubmit()}
          >
            Onayla
          </button>
        </div>
      </div>
      <div id="a-overlay"></div>
      <table className="container">
        <tbody>
          <tr>
            <th className="Checkbox-th">
              <button
                className="select-all-button"
                type="button"
                onClick={() => checkCheckBoxes()}
              >
                Hepsini Seç
              </button>
            </th>
            <th className="Ad-th">Ad</th>
            <th className="Soyad-th">Soyad</th>
            <th className="tcNo-th">T.C. Kimlik Numarası</th>
            <th className="ogrenciNo-th">Ögrenci Numarası</th>
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

export default StudentBody;
