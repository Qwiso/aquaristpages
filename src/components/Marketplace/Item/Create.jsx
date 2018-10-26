import React, { Component } from 'react'

const resetOrientation = (srcBase64, srcOrientation, callback) => {
    let img = new Image();

    img.onload = function() {
        let width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d")

        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height
            canvas.height = width
        } else {
            canvas.width = width
            canvas.height = height
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break
            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break
            case 7: ctx.transform(0, -1, -1, 0, height , width); break
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break
            default: break
        }

        // draw image
        ctx.drawImage(img, 0, 0, width, height)

        // export base64
        callback(canvas.toDataURL('image/png'))
    }

    img.src = srcBase64
}

class CreateMarketItem extends Component {
    state = {  }

    //#region image functions
    fileLoaded = (input) => {
        let file = input.target.files[0]
        if (file.type.match(/image.*/)) {
            this.processImageFile(file, input)
        }
    }

    processImageFile = (file, input) => {
        this.getImageOrientation(file, function(orientation) {
            let reader = new FileReader()
            reader.onload = function (readerEvent) {
                let image = new Image()
                image.onload = function (imageEvent) {
    
                    let canvas = document.createElement('canvas'),
                        max_size = 720,
                        width = image.width,
                        height = image.height
    
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width
                            width = max_size
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height
                            height = max_size
                        }
                    }
    
                    canvas.width = width
                    canvas.height = height
                    canvas.getContext('2d').drawImage(image, 0, 0, width, height)
                    let dataUrl = canvas.toDataURL('image/png')
    
                    resetOrientation(dataUrl, orientation, function(result) {
                        document.querySelector('#form_createMarketItem img').src = result
                    })
                }
                image.src = readerEvent.target.result
            }
            reader.readAsDataURL(file)
        })
    }
    
    getImageOrientation = (file, callback) => {
        let reader = new FileReader()
    
        reader.onload = function(event) {
            let view = new DataView(event.target.result)
    
            if (view.getUint16(0, false) !== 0xFFD8) return callback(-2)
    
            var length = view.byteLength,
                offset = 2
    
            while (offset < length) {
                let marker = view.getUint16(offset, false)
                offset += 2
    
                if (marker === 0xFFE1) {
                    if (view.getUint32(offset += 2, false) !== 0x45786966) {
                        return callback(-1)
                    }
                    var little = view.getUint16(offset += 6, false) === 0x4949
                    offset += view.getUint32(offset + 4, little)
                    var tags = view.getUint16(offset, little)
                    offset += 2
    
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) === 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little))
                }
                else if ((marker & 0xFF00) !== 0xFF00) break
                else offset += view.getUint16(offset, false)
            }
            return callback(-1)
        }
    
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
    }
    //#endregion
    
    render() {
        return (
            <form id="form_createMarketItem">
                <div className="d-flex justify-content-center">
                    <div className="col-8 pt-3">
                        <div className="row pb-3">
                            <div className="col">
                                <select defaultValue="1" onChange={() => {}} className="form-control" name="category" required>
                                    <option value="1" disabled>Choose a Category</option>
                                    <option value="flora">Flora</option>
                                    <option value="fauna">Fauna</option>
                                    <option value="hardware">Hardware</option>
                                </select>
                            </div>
                        </div>

                        <div className="row pb-3">
                            <div className="col">
                                <input type="text" className="form-control" name="title" placeholder="What is the item?" required />
                            </div>
                        </div>

                        <div className="row pb-3">
                            <div className="col">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-dollar-sign" aria-hidden="true"></i></span>
                                    </div>
                                    <input type="number" className="form-control" min="0.00" step="0.25" name="price" placeholder="0.00" required />
                                </div>
                            </div>
                        </div>

                        <div className="row pb-3">
                            <div className="col">
                                <textarea rows="3" className="form-control" name="description" placeholder="Describe your item... (optional)"></textarea>
                            </div>
                        </div>

                        <div className="row pb-3">
                            <div className="col">
                            
                            </div>
                        </div>

                        <div className="row pb-3">
                            <div className="col">
                                <div className="input-group d-flex flex-nowrap">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="far fa-file-image" aria-hidden="true"></i></span>
                                    </div>
                                    <input data-viewtype="create" type="file" accept="image/*" name="media_url" onChange={(e) => this.fileLoaded(e)} required />
                                </div>
                                <button type="submit" className="btn btn-primary float-right">Create</button>
                                <img className="img-fluid d-block mx-auto pt-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
 
export default CreateMarketItem