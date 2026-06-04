text = file.ReadAll 
file.Close 
old = "If the candidate's experience does not match the required experience, also return status Rejected immediately." 
new = "If the candidate's experience does not match the required experience, also return status Rejected immediately. If the job description requires a different technology stack than the resume provides (for example Python/Django/PostgreSQL versus Java/Spring), return Rejected." 
file.Write text 
file.Close 
WScript.Echo "patched" 
