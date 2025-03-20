const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget

    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBody = exampleModal.querySelector('.modal-body')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')
    const action = exampleModal.querySelector('.modal-footer .action')

    modalBody.prepend += "<p>Hello, world!</p>";

    modalTitle.textContent = `${recipient}`
    action.textContent = `${recipient}`

  })
}