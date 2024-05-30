Feature('Restaurant E2E Testing');

Scenario('Add and remove restaurant from favorites', ({ I }) => {
    I.amOnPage('http://localhost:9090/');
    I.waitForElement('.restaurant-list');
 
    I.waitForElement('.restaurant-item', 5);
    I.click(locate('.restaurant-name').first());
    I.waitForElement('.restaurant-detail', 5);
    
    // Melihat tombol favorit dan mengklik tombol tersebut untuk menambahkan ke favorit
    I.see('Tambah ke favorit');
    I.click('#save-restaurant-button');
    I.acceptPopup(); // Menangani pop-up alert
    I.see('Hapus dari Favorit');

    // Masuk ke halaman favorit
    I.amOnPage('http://localhost:9090/favorite.html');
    I.seeElement('.restaurant-item');
    
    // Mengklik nama restoran yang ada pada halaman favorit
    I.see('Melting Pot');
    I.click('Melting Pot');
    I.seeElement('#save-restaurant-button');
    I.see('Hapus dari Favorit');
    I.click('#save-restaurant-button');
    I.acceptPopup(); // Menangani pop-up alert
    

    // Verifikasi bahwa restoran telah dihapus dari favorit
    I.amOnPage("http://localhost:9090/favorite.html");
    I.dontSeeElement('.restaurant-item');
});

Feature('Restaurant E2E Negative Testing');


