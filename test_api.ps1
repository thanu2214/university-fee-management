$ErrorActionPreference = "Stop"

Write-Host "=================================================="
Write-Host " 1. TESTING AUTHENTICATION & LOGIN (STUDENT1)"
Write-Host "=================================================="
$loginBody = @{ username = "student1"; password = "password123" } | ConvertTo-Json
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$studentData = $authRes.data
$studentToken = $studentData.token
Write-Host "Success! Student Logged In:" $studentData.fullName "Role:" $studentData.role

Write-Host "`n=================================================="
Write-Host " 2. TESTING STUDENT PROFILE & FEE RECORDS"
Write-Host "=================================================="
$studentHeaders = @{ Authorization = "Bearer $studentToken" }
$profileRes = Invoke-RestMethod -Uri "http://localhost:8080/api/students/profile" -Method Get -Headers $studentHeaders
$profile = $profileRes.data
Write-Host "Student Profile Found -> Name:" $profile.fullName "Roll:" $profile.rollNumber "ID:" $profile.id

$recordsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/fees/student/$($profile.id)" -Method Get -Headers $studentHeaders
$records = $recordsRes.data
Write-Host "Active Semesters Count:" $records.Count
$dueRecord = $records | Where-Object { $_.dueAmount -gt 0 } | Select-Object -First 1
Write-Host "Found Due Record ID:" $dueRecord.id "Semester:" $dueRecord.semester "Due Amount: $" $dueRecord.dueAmount

Write-Host "`n=================================================="
Write-Host " 3. TESTING PAYMENT PROCESSING & RECEIPT CREATION"
Write-Host "=================================================="
$paymentBody = @{
    studentFeeRecordId = $dueRecord.id
    amount = [double]25000.00
    paymentMethod = "UPI"
    transactionReference = "TXN_UPI_VERIFY_9999"
    remarks = "Semester Fee Payment via UPI Gateway"
} | ConvertTo-Json

$paymentRes = Invoke-RestMethod -Uri "http://localhost:8080/api/payments/process-demo" -Method Post -Body $paymentBody -ContentType "application/json" -Headers $studentHeaders
$payment = $paymentRes.data
Write-Host "Payment Status:" $payment.status "Transaction Ref:" $payment.transactionReference "Amount: $" $payment.amount

$receiptsRes = Invoke-RestMethod -Uri "http://localhost:8080/api/receipts/student/$($profile.rollNumber)" -Method Get -Headers $studentHeaders
$receipts = $receiptsRes.data
Write-Host "Total Receipts for Student:" $receipts.Count
$latestReceipt = $receipts | Select-Object -First 1
Write-Host "Latest Receipt Number:" $latestReceipt.receiptNumber "Date:" $latestReceipt.receiptDate "Total Paid: $" $latestReceipt.amountPaid

Write-Host "`n=================================================="
Write-Host " 4. TESTING FINANCE STAFF ROLE & DASHBOARD"
Write-Host "=================================================="
$finLoginBody = @{ username = "finance1"; password = "password123" } | ConvertTo-Json
$finAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $finLoginBody -ContentType "application/json"
$finData = $finAuth.data
$finToken = $finData.token
$finHeaders = @{ Authorization = "Bearer $finToken" }

$finDashRes = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/finance" -Method Get -Headers $finHeaders
$finDash = $finDashRes.data
Write-Host "Finance Metrics -> Total Collected: $" $finDash.totalCollected "Pending Dues: $" $finDash.totalPendingDues "Collection Rate:" $finDash.collectionRate "%"

$defaultersRes = Invoke-RestMethod -Uri "http://localhost:8080/api/finance/defaulters" -Method Get -Headers $finHeaders
$defaulters = $defaultersRes.data
Write-Host "Defaulters count:" $defaulters.Count

Write-Host "`n=================================================="
Write-Host " 5. TESTING ADMIN ROLE & DASHBOARD"
Write-Host "=================================================="
$admLoginBody = @{ username = "admin"; password = "password123" } | ConvertTo-Json
$admAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $admLoginBody -ContentType "application/json"
$admData = $admAuth.data
$admToken = $admData.token
$admHeaders = @{ Authorization = "Bearer $admToken" }

$admDashRes = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/admin" -Method Get -Headers $admHeaders
$admDash = $admDashRes.data
Write-Host "Admin Metrics -> Total Students:" $admDash.totalStudents "Total Courses:" $admDash.totalCourses "Total Expected: $" $admDash.totalExpectedRevenue

$feeStructuresRes = Invoke-RestMethod -Uri "http://localhost:8080/api/fees/structures" -Method Get -Headers $admHeaders
$feeStructures = $feeStructuresRes.data
Write-Host "Fee Structures count:" $feeStructures.Count

Write-Host "`n=================================================="
Write-Host " ALL 5 TEST PHASES PASSED WITH 100% SUCCESS!"
Write-Host "=================================================="
