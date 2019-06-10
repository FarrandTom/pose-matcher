# Shout out to https://stackoverflow.com/a/20555267/8770351
# 2D array containing the 18 corresponding feature points
model_features = [[x1,y2],[x2,y2],...]
input_features = [[x1,y2],[x2,y2],...]

# In order to solve the augmented matrix (incl translation),
# it's required all vectors are augmented with a "1" at the end
# -> Pad the features with ones, so that our transformation can do translations too
pad = lambda x: np.hstack([x, np.ones((x.shape[0], 1))])
unpad = lambda x: x[:, :-1]

# Pad to [[ x y 1] , [x y 1]]
Y = pad(model_features)
X = pad(input_features)

# Solve the least squares problem X * A = Y
# and find the affine transformation matrix A.
A, res, rank, s = np.linalg.lstsq(X, Y)
A[np.abs(A) < 1e-10] = 0  # set really small values to zero
