var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM items ORDER BY id DESC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('items/list', {
					title: 'Items List', 
					data: ''
				})
			} else {
				// render to views/items/list.ejs template file
				res.render('items/list', {
					title: 'Items List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/items/add.ejs
	res.render('items/add', {
		title: 'Add New Item',
		name: '',
		qty: '',
		amount: ''		
	})
})

// ADD NEW ITEM POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('qty', 'Age is required').notEmpty()             //Validate qty
    req.assert('amount', 'A valid amount is required').notEmpty()  //Validate amount

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		var items = {
			name: req.sanitize('name').escape().trim(),
			qty: req.sanitize('qty').escape().trim(),
			amount: req.sanitize('amount').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO items SET ?', items, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/items/add.ejs
					res.render('items/add', {
						title: 'Add New User',
						name: items.name,
						qty: items.qty,
						amount: items.amount					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/items/add.ejs
					res.render('items/add', {
						title: 'Add New User',
						name: '',
						qty: '',
						amount: ''					
					})
				}
			})
		})
	}
	else {   //Display errors to items
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('items/add', { 
            title: 'Add New User',
            name: req.body.name,
            qty: req.body.qty,
            amount: req.body.amount
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM items WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if items not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/items')
			}
			else { // if items found
				// render to views/items/edit.ejs template file
				res.render('items/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					qty: rows[0].qty,
					amount: rows[0].amount					
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('qty', 'Age is required').notEmpty()             //Validate qty
    req.assert('amount', 'A valid amount is required').notEmpty()  //Validate amount

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		var items = {
			name: req.sanitize('name').escape().trim(),
			qty: req.sanitize('qty').escape().trim(),
			amount: req.sanitize('amount').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE items SET ? WHERE id = ' + req.params.id, items, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/items/add.ejs
					res.render('items/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						qty: req.body.qty,
						amount: req.body.amount
					})
				} else {
					req.flash('success', 'Data updated successfuly!')
					
					// render to views/items/add.ejs
					res.render('items/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						qty: req.body.qty,
						amount: req.body.amount
					})
				}
			})
		})
	}
	else {   //Display errors to items
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('items/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			qty: req.body.qty,
			amount: req.body.amount
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var items = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM items WHERE id = ' + req.params.id, items, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/items')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/items')
			}
		})
	})
})

module.exports = app
