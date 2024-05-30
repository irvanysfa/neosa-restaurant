Feature('Review E2E Testing');

Scenario('Add review', ({ I }) => {
    I.amOnPage('http://localhost:9090/');
    I.waitForElement('.restaurant-item', 5);
    I.click(locate('.restaurant-name').first());
    I.waitForElement('.restaurant-detail', 5);
    
    // Melihat tombol favorit dan mengklik tombol tersebut untuk menambahkan ke favorit
    I.seeElement('#add-review-form');
    const Name = 'Ucup';
    const Review ='Enak sekali';
    I.fillField('#name', Name);
    I.fillField('#review', Review);
    I.click('Submit')
    I.acceptPopup(); 
    I.see(Review, "#customer-reviews");
});

Scenario('Failed to Add review', ({ I }) => {
    I.amOnPage('http://localhost:9090/');
    I.waitForElement('.restaurant-item', 5);
    I.click(locate('.restaurant-name').first());
    I.waitForElement('.restaurant-detail', 5);
    
    // Melihat tombol favorit dan mengklik tombol tersebut untuk menambahkan ke favorit
    I.seeElement('#add-review-form');
    const Review ='Enak sekali';
    I.fillField('#review', Review);
    I.click('Submit')
    I.see('Name and review are required.','#review-alert-modal' );
});




